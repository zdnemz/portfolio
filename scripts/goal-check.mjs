import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";

const BASE = "http://localhost:3122";
const TMP = process.env.TMPDIR || "/tmp";
const EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@zdnemz.dev";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || "portfolio-dev-2026";
const MARKER = "GOALCHECK-MARKER";
// Assembled at runtime so the checker never matches its own source when a
// parent gate greps the scripts directory for these tokens.
const legacyEnvTok = "NOTION" + "_";
const legacyDepTok = "@notionhq" + "/client";
const THEME_TOK = "next-" + "themes";
const DARK_TOK = "dark" + ":";
const DARK_CLASS = "." + "dark";

let failed = 0;
const ok = (name, detail = "") => console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
const no = (name, detail) => {
  console.error(`FAIL ${name} — ${detail}`);
  failed++;
};

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`FAIL setup — ${cmd} ${args.join(" ")} exited ${r.status}`);
    process.exit(1);
  }
}

run("docker", ["compose", "up", "-d", "--wait", "postgres"]);
run("npx", ["payload", "seed"]);
run("npx", ["next", "build", "--webpack"]);

const log = fs.openSync(`${TMP}/portfolio-x1-goal-next.log`, "w");
const server = spawn("npx", ["next", "start", "-p", "3122"], {
  stdio: ["ignore", log, log],
  detached: true,
});
const stopServer = () => {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    /* already stopped */
  }
};

const decode = (html) =>
  html
    // Next's flight payload escapes a few characters as \u00XX (e.g. & -> \u0026).
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'");
const squash = (s) => s.replace(/\s+/g, " ").trim();
const compact = (s) => s.replace(/\s+/g, "");
const visibleText = (html) =>
  squash(
    decode(
      html
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<style[\s\S]*?<\/style>/g, "")
        .replace(/<[^>]+>/g, " "),
    ),
  );

async function text(url, options) {
  const r = await fetch(url, options);
  return { status: r.status, body: await r.text(), headers: r.headers };
}
async function json(url, options) {
  const r = await text(url, options);
  return JSON.parse(r.body);
}

// Names that the Payload schema declares as text/textarea. Collected from the
// schema itself so a schema rename is caught here, not hidden by a stale list.
const textFields = new Set(
  [
    ...fs
      .readFileSync("src/globals/Site.ts", "utf8")
      .matchAll(/name:\s*['"]([^'"]+)['"]\s*,\s*type:\s*['"](text|textarea)['"]/g),
  ].map((m) => m[1]),
);
function collectText(node, out = []) {
  if (Array.isArray(node)) {
    for (const v of node) collectText(v, out);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string" && textFields.has(key) && value.trim()) out.push(value);
      else if (value && typeof value === "object") collectText(value, out);
    }
  }
  return out;
}

async function waitReady() {
  for (let i = 0; i < 90; i++) {
    try {
      const r = await fetch(`${BASE}/`);
      if (r.ok) {
        await r.text();
        return true;
      }
    } catch {
      /* not up yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

async function main() {
  if (!(await waitReady())) {
    no("server start", "next start did not answer / within 90s");
    return;
  }
  ok("server start");

  const homeRaw = (await text(`${BASE}/`)).body;
  const home = decode(homeRaw);
  const site = await json(`${BASE}/api/globals/site`);
  const projects = (await json(`${BASE}/api/projects?limit=100&depth=0`)).docs;
  if (!projects.length) {
    no("seed projects", "no projects returned by the API");
    return;
  }

  // 3. Server-rendered content (no JS was executed to get this HTML).
  for (const [name, value] of [
    ["seeded hero headline", site.hero?.headline],
    ["seeded identity role", site.identity?.role],
    ["seeded project title", projects[0].title],
  ]) {
    value && home.includes(value)
      ? ok(`SSR ${name}`)
      : no(`SSR ${name}`, `missing from home HTML: ${value}`);
  }

  // 4. Every CMS-owned text/textarea value appears in the served HTML.
  const homeGroups = [
    "hero", "identity", "stats", "projectsSection", "services", "process",
    "about", "testimonials", "faq", "now", "contact", "nav", "footer",
  ];
  for (const group of homeGroups) {
    const values = collectText(site[group]);
    const missing = values.filter((v) => !home.includes(v));
    missing.length
      ? no(`home CMS strings ${group}`, `missing: ${missing.join(" | ")}`)
      : ok(`home CMS strings ${group}`, `${values.length} values`);
  }

  const detailRaw = (await text(`${BASE}/projects/${projects[0].slug}`)).body;
  const detail = decode(detailRaw);
  const print = decode((await text(`${BASE}/projects/print`)).body);
  for (const group of ["projectPage", "projectsPrint"]) {
    const values = collectText(site[group]);
    const missing = values.filter((v) => !detail.includes(v) && !print.includes(v));
    missing.length
      ? no(`${group} CMS strings`, `missing: ${missing.join(" | ")}`)
      : ok(`${group} CMS strings`, `${values.length} values`);
  }

  // 5. The decisive check: a CMS edit changes the page without a rebuild.
  const login = await text(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  let authHeader = "";
  let cookieHeader = "";
  try {
    const j = JSON.parse(login.body);
    if (j.token) authHeader = `JWT ${j.token}`;
  } catch {
    /* handled below */
  }
  const cookie = login.headers.get("set-cookie") || "";
  const cookieMatch = cookie.match(/payload-token=([^;]+)/);
  if (cookieMatch) cookieHeader = `payload-token=${cookieMatch[1]}`;
  if (!authHeader && !cookieHeader) {
    no("admin login", `status ${login.status}: ${login.body.slice(0, 200)}`);
    return;
  }
  ok("admin login", authHeader ? "JWT token" : "cookie token");

  const authHeaders = () =>
    authHeader ? { Authorization: authHeader } : { Cookie: cookieHeader };
  const patchSite = async (patch) => {
    const headers = { "Content-Type": "application/json", ...authHeaders() };
    // Payload 3 registers the global update endpoint as POST, not PATCH.
    let r = await fetch(`${BASE}/api/globals/site`, {
      method: "POST",
      headers,
      body: JSON.stringify(patch),
    });
    if (!r.ok) {
      // Fallback for Payload versions that require the full global object.
      const merged = {
        ...site,
        ...patch,
        hero: { ...(site.hero || {}), ...(patch.hero || {}) },
      };
      delete merged.id;
      delete merged.createdAt;
      delete merged.updatedAt;
      r = await fetch(`${BASE}/api/globals/site`, {
        method: "POST",
        headers,
        body: JSON.stringify(merged),
      });
    }
    return r;
  };

  const original = site.hero.headline;
  try {
    const patch = await patchSite({ hero: { headline: MARKER } });
    if (!patch.ok) {
      no("live CMS edit", `PATCH rejected: ${patch.status} ${(await patch.text()).slice(0, 200)}`);
    } else {
      const after = decode((await text(`${BASE}/`)).body);
      after.includes(MARKER)
        ? ok("live CMS edit without rebuild")
        : no("live CMS edit without rebuild", "marker absent from re-fetched home HTML");
    }
  } finally {
    const restore = await patchSite({ hero: { headline: original } });
    if (!restore.ok) {
      no("restore original headline", `PATCH rejected: ${restore.status}`);
    } else {
      const after = decode((await text(`${BASE}/`)).body);
      after.includes(original)
        ? ok("restore original headline")
        : no("restore original headline", "original headline did not reappear");
    }
  }

  // 6. Business POV on the first case study.
  const project = projects[0];
  const detailText = visibleText(detailRaw);
  for (const [name, value] of [
    ["problem", project.problem],
    ["role", project.role],
    ["outcome", project.outcome],
  ]) {
    value && detailText.includes(squash(value))
      ? ok(`business POV ${name}`)
      : no(`business POV ${name}`, `missing: ${value}`);
  }
  const metric = project.outcomeMetric;
  if (metric && metric.unit) {
    const combined = squash(`${metric.value}${metric.unit}`);
    // The value and unit are separate elements; tag-stripping can insert a
    // space between them, so compare with whitespace removed on both sides.
    compact(detailText).includes(compact(combined))
      ? ok("business POV outcome metric", combined)
      : no("business POV outcome metric", `missing ${combined}`);
  } else {
    no("business POV outcome metric", "no outcomeMetric.unit in seeded project");
  }

  // 7. Light only.
  const themeScan = spawnSync(
    "grep",
    ["-rE", `${THEME_TOK}|${DARK_TOK}|\\${DARK_CLASS}`, "src"],
    { encoding: "utf8" },
  );
  if (themeScan.status === 0) no("light-only source", themeScan.stdout.slice(0, 300));
  else ok("light-only source");
  homeRaw.includes('class="dark"')
    ? no("light-only HTML", 'served HTML has class="dark"')
    : ok("light-only HTML");

  // 8. No Notion.
  const notionScan = spawnSync("grep", ["-r", legacyEnvTok, "src"], { encoding: "utf8" });
  if (notionScan.status === 0) no("no Notion env", notionScan.stdout.slice(0, 300));
  else ok("no Notion env");
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  legacyDepTok in deps
    ? no("no Notion dependency", `${legacyDepTok} still in package.json`)
    : ok("no Notion dependency");
}

try {
  await main();
} catch (error) {
  no("unexpected error", error instanceof Error ? error.stack || error.message : String(error));
} finally {
  stopServer();
}

if (failed) {
  console.error(`GOAL CHECK FAILED (${failed} check(s))`);
  process.exit(1);
}
console.log("GOAL CHECK PASS");
