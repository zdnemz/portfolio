#!/usr/bin/env bash
# Assembled-product gate: build, boot, exercise every seam, then check leftovers.
set -euo pipefail

TMP_ROOT="${TMPDIR:-/tmp}"
BASE="http://localhost:3111"
ADMIN_EMAIL="${SEED_ADMIN_EMAIL:-admin@zdnemz.dev}"
ADMIN_PASSWORD="${SEED_ADMIN_PASSWORD:-portfolio-dev-2026}"

docker compose up -d --wait postgres
npx payload seed
npx next build --webpack

npx next start -p 3111 > "$TMP_ROOT/portfolio-x1-next.log" 2>&1 &
SRV=$!
trap 'kill "$SRV" 2>/dev/null || true; pkill -P "$SRV" 2>/dev/null || true' EXIT

ready=0
for _ in $(seq 1 60); do
  if curl -sf -o /dev/null "$BASE/"; then ready=1; break; fi
  sleep 1
done
[ "$ready" = 1 ] || { echo "FAIL server did not start"; tail -40 "$TMP_ROOT/portfolio-x1-next.log"; exit 1; }

fail=0
check() {
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$1")
  [[ "$code" =~ $2 ]] || { echo "FAIL $1 -> $code (want $2)"; fail=1; }
}

check / '^200$'
check /projects '^200$'
check /projects/print '^200$'
check /admin '^(200|302|307)$'
check /api/globals/site '^200$'
check /gallerytest '^404$'

HOME_HTML="$TMP_ROOT/portfolio-x1-home.html"
curl -s "$BASE/" > "$HOME_HTML"

# Every internal href resolves to something below 400.
links=$(grep -o 'href="/[^"#]*"' "$HOME_HTML" | sed 's/href="//; s/"$//' | sort -u || true)
for p in $links; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$p")
  [ "$code" -lt 400 ] || { echo "FAIL dead link $p -> $code"; fail=1; }
done

# Every in-page anchor has a target in the same HTML.
anchors=$(grep -o 'href="#[a-zA-Z0-9_-]*"' "$HOME_HTML" | sed 's/href="#//; s/"$//' | sort -u || true)
for id in $anchors; do
  grep -Fq "id=\"$id\"" "$HOME_HTML" || { echo "FAIL anchor #$id has no target"; fail=1; }
done

# Every seeded project detail renders.
slugs=$(curl -s "$BASE/api/projects?limit=100&depth=0" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{for(const x of JSON.parse(d).docs)console.log(x.slug)})")
for slug in $slugs; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/projects/$slug")
  [ "$code" = 200 ] || { echo "FAIL /projects/$slug -> $code"; fail=1; }
done

node scripts/check-cms-fields.mjs

# Primary path: recruiter lands on home, opens a case study, sees its labels.
grep -Fq 'id="projects"' "$HOME_HTML" || { echo 'FAIL home missing id="projects"'; fail=1; }
FIRST_SLUG=$(curl -s "$BASE/api/projects?limit=1&depth=0" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).docs[0].slug))")
curl -s "$BASE/projects/$FIRST_SLUG" > "$TMP_ROOT/portfolio-x1-detail.html"
curl -s "$BASE/api/globals/site" > "$TMP_ROOT/portfolio-x1-site.json"
for key in problemLabel roleLabel outcomeLabel timelineLabel; do
  needle=$(node -e "const fs=require('fs');const s=JSON.parse(fs.readFileSync('$TMP_ROOT/portfolio-x1-site.json','utf8'));console.log(s.projectPage['$key'])")
  [ -n "$needle" ] || { echo "FAIL empty CMS label $key"; fail=1; continue; }
  grep -Fq -- "$needle" "$TMP_ROOT/portfolio-x1-detail.html" || { echo "FAIL detail missing $needle"; fail=1; }
done

# Contact round-trip. Create is public; counting reads needs an admin JWT.
TOKEN=$(curl -s -X POST "$BASE/api/users/login" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);console.log(j.token||'')})")
[ -n "$TOKEN" ] || { echo "FAIL admin login for submission count"; fail=1; }
count_submissions() {
  curl -s "$BASE/api/contact-submissions?limit=0&depth=0" -H "Authorization: JWT $TOKEN" \
    | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).totalDocs))"
}
before=$(count_submissions)
curl -s -X POST "$BASE/api/contact-submissions" -H 'Content-Type: application/json' \
  -d '{"name":"Gate Bot","email":"gate@example.com","message":"integration gate"}' > /dev/null
after=$(count_submissions)
[ "$after" -gt "$before" ] || { echo "FAIL contact submission not stored ($before -> $after)"; fail=1; }

# Leftovers. Tokens are assembled so this script does not match its own grep.
legacyEnvTok='NOT''ION_'
CLIENT_TOK='@not''ionhq/client'
THEME_TOK='next-''themes'
VARIANT_TOK='@custom-''variant dark'
DARK_TOK='dark'':'
if grep -rn --exclude='integration-gate.sh' --exclude='goal-check.mjs' --exclude='check-cms-fields.mjs' \
    "$legacyEnvTok\|$CLIENT_TOK\|$THEME_TOK\|$VARIANT_TOK\|$DARK_TOK" src scripts 2>/dev/null; then
  echo "FAIL leftover Notion/theme tokens"; fail=1
fi
if grep -rn "const FAQS\|const STEPS\|const STACK\|MARQUEE_ITEMS\|NOW_ITEMS" src/components 2>/dev/null; then
  echo "FAIL hardcoded marketing data in components"; fail=1
fi
if grep -n '"use client"' 'src/app/(frontend)/page.tsx' 2>/dev/null; then
  echo "FAIL home page is a client component"; fail=1
fi
if grep -rn "writing" src/components/navbar.tsx src/components/reading-progress-rail.tsx 2>/dev/null; then
  echo "FAIL stale writing nav item"; fail=1
fi
for p in src/lib/notion src/types bun.lock public/__test.mp4 projects-mobile.png src/app/gallerytest; do
  [ ! -e "$p" ] || { echo "FAIL leftover path $p"; fail=1; }
done

[ "$fail" = 0 ] || exit 1
echo "INTEGRATION GATE PASS"
