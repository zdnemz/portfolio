import fs from "node:fs";
import path from "node:path";

const read = (p) => fs.readFileSync(p, "utf8");
// Site.ts and Projects.ts mix single-quoted group names with double-quoted
// leaf names. Capture both so a field like `hero.headline` is recognised.
const names = (src) =>
  new Set([...src.matchAll(/name:\s*['"]([a-zA-Z][\w]*)['"]/g)].map((m) => m[1]));

const siteSrc = read("src/globals/Site.ts");
const siteNames = names(siteSrc);
const groups = [
  "seo", "identity", "hero", "stats", "projectsSection", "services", "process",
  "about", "testimonials", "github", "faq", "now", "contact", "nav", "footer",
  "projectPage", "projectsPrint",
];
for (const g of groups) {
  if (!siteNames.has(g)) {
    console.error("missing site group", g);
    process.exit(1);
  }
}

const projectNames = names(read("src/collections/Projects.ts"));

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : /\.(tsx|ts)$/.test(d.name) ? [p] : [];
  });

let bad = 0;
for (const file of walk("src/components")) {
  const src = read(file);
  for (const m of src.matchAll(/\bsite\.([a-zA-Z]\w*)\.([a-zA-Z]\w*)/g)) {
    const [, group, field] = m;
    if (!siteNames.has(group)) {
      console.error(`${file}: site.${group} is not a group`);
      bad++;
    }
    if (!siteNames.has(field)) {
      console.error(`${file}: site.${group}.${field} — no such field`);
      bad++;
    }
  }
  for (const m of src.matchAll(/\bsite\.([a-zA-Z]\w*)\b(?!\.)/g)) {
    if (!siteNames.has(m[1])) {
      console.error(`${file}: site.${m[1]} — no such group`);
      bad++;
    }
  }
  if (/ProjectDetail|ProjectCard/.test(src)) {
    for (const m of src.matchAll(/\bproject\.([a-zA-Z]\w*)/g)) {
      if (!projectNames.has(m[1]) && !["id", "media", "mediaAlt", "metric"].includes(m[1])) {
        console.error(`${file}: project.${m[1]} — no such field`);
        bad++;
      }
    }
  }
}
if (bad) process.exit(1);
console.log("CMS FIELD CROSS-CHECK PASS");
