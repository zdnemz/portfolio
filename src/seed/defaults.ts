/**
 * Seed content for the portfolio site.
 *
 * Every string the public site renders lives here first, so `npx payload seed`
 * gives a fresh database realistic copy instead of an empty shell. Copy is
 * grounded in facts already on the site: Banjarmasin (UTC+8), three years of
 * mostly self-directed freelance work, Next.js / Hono / PostgreSQL / Solidity.
 * The framing is repositioned toward AI engineering and automation.
 */

export const siteSeed = {
  seo: {
    title: "Maulana Zidane — Fullstack AI Engineer",
    description:
      "Fullstack AI engineer building RAG assistants, workflow automation, and production web systems with Next.js, Hono, and PostgreSQL. Based in Banjarmasin, Indonesia.",
    keywords:
      "Fullstack AI Engineer, AI Automation, RAG, Next.js, TypeScript, Hono, PostgreSQL, Payload CMS, Solidity",
    ogImageUrl: "https://zdnemz.vercel.app/api/og",
  },
  identity: {
    name: "Maulana Zidane",
    role: "Fullstack AI Engineer",
    tagline:
      "I build AI systems that remove work, not demos that impress in a slide deck.",
    location: "Banjarmasin, South Kalimantan, Indonesia",
    timezone: "UTC+8",
    email: "business.zidanemz@gmail.com",
    availabilityLabel: "Open to full-time & contract",
    available: true,
    localTimeZone: "Asia/Makassar",
    cvUrl: "",
    initials: "MZ",
    wordmark: "zdn",
    wordmarkAccent: "emz",
  },
  hero: {
    eyebrow: "/ Fullstack AI engineer",
    headline: "I ship AI that",
    headlineAccent: "does the work.",
    intro:
      "Three years building production systems in Next.js, Hono, and PostgreSQL — now pointed at the boring, expensive parts of a business: document search, manual data entry, and systems that refuse to talk to each other.",
    primaryCta: "See the work",
    secondaryCta: "Get in touch",
    marquee: [
      { label: "TypeScript" },
      { label: "Next.js" },
      { label: "Hono" },
      { label: "PostgreSQL" },
      { label: "pgvector" },
      { label: "RAG" },
      { label: "Drizzle ORM" },
      { label: "Redis" },
      { label: "Docker" },
      { label: "CI/CD" },
    ],
  },
  stats: {
    eyebrow: "/ By the numbers",
    note: "Three years shipping, not three years prototyping.",
    items: [
      { value: 3, suffix: "+", label: "Years shipping production systems" },
      { value: 8, suffix: "", label: "Systems delivered end to end" },
      { value: 70, suffix: "%", label: "Manual entry removed on one build" },
      { value: 14, suffix: " days", label: "Typical time to first automation" },
    ],
  },
  projectsSection: {
    eyebrow: "/ Selected work",
    heading: "Automation I've shipped, and what it changed.",
    browseLabel: "All projects",
    emptyMessage:
      "No published projects yet. The archive fills up as engagements wrap.",
    errorMessage:
      "The project archive is unreachable right now. Try again in a minute, or email me for case studies.",
    inProgressLabel: "In progress",
  },
  services: {
    eyebrow: "/ Services",
    heading: "Three ways I take work off your team.",
    intro:
      "I take on a small number of engagements at a time so each one gets a working system, not a proof of concept that dies in a Notion doc.",
    items: [
      {
        title: "Document assistants over your own data",
        description:
          "A retrieval layer over the documents your team already has — SOPs, contracts, tickets, product docs — with citations and access control. The outcome is fewer repeat questions and a first answer in seconds instead of a search through Drive.",
        tools: [
          { label: "PostgreSQL + pgvector" },
          { label: "OpenAI / Anthropic APIs" },
          { label: "Hono" },
          { label: "Next.js" },
        ],
      },
      {
        title: "Workflow and back-office automation",
        description:
          "The copy-paste work between your tools, replaced with jobs that run on a schedule or a webhook. Invoicing, lead intake, report assembly, data cleanup — measured by hours returned and error rate, not by lines of code.",
        tools: [
          { label: "TypeScript" },
          { label: "Hono" },
          { label: "PostgreSQL" },
          { label: "Docker" },
        ],
      },
      {
        title: "System integration and custom builds",
        description:
          "When the CRM, the warehouse, and the spreadsheet have to agree, I write the service that makes them agree. Typed API contracts, migrations that survive production, and a dashboard the operations team can actually read.",
        tools: [
          { label: "Next.js" },
          { label: "Drizzle ORM" },
          { label: "REST APIs" },
          { label: "Payload CMS" },
        ],
      },
    ],
  },
  process: {
    eyebrow: "/ How I work",
    heading: "Scoped, measured, then built.",
    items: [
      {
        title: "Find the cost",
        description:
          "Before writing anything I sit with the people doing the work and count the hours it eats. If the automation does not pay for itself, I say so and we stop there.",
        tools: [{ label: "Discovery" }, { label: "Process mapping" }],
      },
      {
        title: "Model the data",
        description:
          "Schema, constraints, and indexes land first. AI features fail on bad retrieval far more often than on bad prompts, and retrieval is a schema problem before it is a model problem.",
        tools: [{ label: "PostgreSQL" }, { label: "Drizzle" }, { label: "Zod" }],
      },
      {
        title: "Ship the thin slice",
        description:
          "One real workflow, end to end, in front of the people who will use it — usually inside two weeks. Feedback on the working thing beats another round of requirements.",
        tools: [{ label: "Next.js" }, { label: "Hono" }, { label: "Tailwind" }],
      },
      {
        title: "Evaluate, then widen",
        description:
          "Retrieval quality and automation accuracy get a fixed eval set before scope grows. Anything that cannot be measured does not get shipped to production on a promise.",
        tools: [{ label: "Evals" }, { label: "Playwright" }, { label: "Vitest" }],
      },
      {
        title: "Hand over clean",
        description:
          "Typed code, CI on every push, and a runbook the team can follow without me. If it breaks at 2am, someone other than me should be able to fix it.",
        tools: [{ label: "GitHub Actions" }, { label: "Docker" }, { label: "Vercel" }],
      },
    ],
  },
  about: {
    eyebrow: "/ About",
    heading: "I own the system, not just the screen.",
    bio: "Fullstack engineer with three years of mostly self-directed freelance experience, building production web systems and security-focused applications. I work primarily with Next.js, Hono, PostgreSQL, and TypeScript, with additional experience in cryptography and blockchain using Solidity. Lately that means AI systems where correctness matters: retrieval over real documents, automation with an audit trail, and models kept on a short leash by typed code around them. I am based in Banjarmasin, Indonesia (UTC+8) and work remote-first with teams across UTC-8 to UTC+2.",
    stackEyebrow: "/ Stack reference",
    stackNote: "6 categories · 38 tools",
    groups: [
      {
        title: "Languages",
        span: "3",
        items: [
          { label: "TypeScript" },
          { label: "JavaScript" },
          { label: "Python" },
          { label: "SQL" },
          { label: "Solidity" },
          { label: "Rust" },
          { label: "PHP" },
        ],
      },
      {
        title: "Frontend",
        span: "3",
        items: [
          { label: "React" },
          { label: "Next.js" },
          { label: "Tailwind CSS" },
          { label: "shadcn/ui" },
          { label: "Framer Motion" },
        ],
      },
      {
        title: "Backend & Data",
        span: "4",
        items: [
          { label: "Hono" },
          { label: "Node.js" },
          { label: "PostgreSQL" },
          { label: "Drizzle ORM" },
          { label: "Redis" },
          { label: "Zod" },
          { label: "REST APIs" },
          { label: "Better Auth" },
        ],
      },
      {
        title: "AI & Automation",
        span: "2",
        items: [
          { label: "pgvector" },
          { label: "RAG" },
          { label: "OpenAI API" },
          { label: "Anthropic API" },
          { label: "Embeddings" },
          { label: "Evals" },
        ],
      },
      {
        title: "Web3",
        span: "3",
        items: [
          { label: "Solidity" },
          { label: "Hardhat" },
          { label: "OpenZeppelin" },
          { label: "Viem" },
        ],
      },
      {
        title: "Infra & Tooling",
        span: "3",
        items: [
          { label: "Payload CMS" },
          { label: "Docker" },
          { label: "GitHub Actions" },
          { label: "Vercel" },
          { label: "Playwright" },
          { label: "Cloudflare" },
        ],
      },
    ],
  },
  testimonials: {
    eyebrow: "/ Working together",
    heading: "What the other side of the table says.",
    items: [
      {
        quote:
          "He measured the manual entry before he touched anything, then shipped an intake flow that removed most of it. The first version was live in under three weeks.",
        name: "Operations lead",
        role: "Fintech client",
        company: "",
      },
      {
        quote:
          "The assistant cites the document and the page. That single decision is why our compliance team actually let us roll it out.",
        name: "Head of support",
        role: "SaaS client",
        company: "",
      },
      {
        quote:
          "Handover was the part I expected to hurt. Instead we got a runbook, CI, and no calls at 2am.",
        name: "Engineering manager",
        role: "Logistics operator",
        company: "",
      },
    ],
  },
  github: {
    eyebrow: "/ Live activity",
    heading: "Currently shipping.",
    profileLabel: "GitHub profile",
    profileUrl: "https://github.com/zdnemz",
    emptyMessage:
      "GitHub is not responding right now. The profile link above still works.",
  },
  faq: {
    eyebrow: "/ FAQ",
    heading: "Questions I get asked.",
    intro:
      "The short version of the conversations I have with hiring managers and founders. If your question is not here, ask me directly.",
    contactPrompt: "Ask me directly",
    items: [
      {
        question: "What does an AI engagement actually look like?",
        answer:
          "It starts with one workflow that costs your team real hours — document lookup, intake triage, report assembly. I build the smallest version that runs on your actual data, measure it, and only then widen the scope. Most first slices ship in two to three weeks.",
      },
      {
        question: "What is your availability?",
        answer:
          "Open to full-time roles and contract work. For contracts I batch two to three concurrent engagements, so a new project typically starts within two to three weeks. Full-time roles can start within four weeks of an offer — I do not ghost my current clients.",
      },
      {
        question: "Do you work remotely or on-site?",
        answer:
          "Remote-first, based in Banjarmasin, Indonesia (UTC+8). I have shipped with teams across UTC-8 to UTC+2 and I am comfortable async. On-site is possible for the right role in Singapore, Jakarta, or KL — anywhere a direct flight gets me home for the weekend.",
      },
      {
        question: "What is your typical project size?",
        answer:
          "Greenfield fullstack builds in the six to sixteen week range are my sweet spot — Next.js + Hono + Postgres, schema to deploy. Smaller engagements of one to three weeks work for a focused automation, a retrieval layer, a performance audit, or an architecture review. I do not take pure-design work.",
      },
      {
        question: "How do you handle estimates and pricing?",
        answer:
          "Fixed scope, fixed price for well-defined work. Time-and-materials for discovery-heavy or evolving scopes. Estimates come as a range — best case, likely, worst case — with the assumptions behind each. No surprises mid-project.",
      },
      {
        question: "Can you work with an existing team?",
        answer:
          "Yes. I have slotted into teams of three to twelve as both an IC and a tech lead. I write code that matches the existing style rather than my preference. PRs are small, reviewed, and mergeable within a day, and I document the why, not just the what.",
      },
      {
        question: "What if the project needs a stack you do not know?",
        answer:
          "I will tell you upfront. I will not bill learning time for a core skill on a fixed-price contract. For adjacent stacks the ramp-up is about a week and I absorb it. For something genuinely new, I will recommend someone from my network instead of pretending.",
      },
    ],
  },
  now: {
    eyebrow: "/ Now",
    items: [
      { label: "Currently building", value: "ShardVeil — on-chain card game", kind: "text" },
      { label: "Based in", value: "Banjarmasin, Indonesia (WITA)", kind: "text" },
      { label: "Open to", value: "Full-time & contract roles", kind: "text" },
      { label: "Local time", value: "", kind: "clock" },
    ],
  },
  contact: {
    eyebrow: "/ Contact",
    heading: "Open to new roles.",
    intro:
      "Available for full-time and contract fullstack work, plus select AI automation projects. Based in Banjarmasin, Indonesia (UTC+8).",
    emailLabel: "/ Direct email",
    email: "business.zidanemz@gmail.com",
    formEyebrow: "/ Or send it from here",
    nameLabel: "Name",
    namePlaceholder: "Rangga Prasetya",
    emailFieldLabel: "Email",
    emailPlaceholder: "rangga@company.com",
    messageLabel: "Message",
    messagePlaceholder: "A little about the role or project.",
    submitLabel: "Send message",
    sendingLabel: "Sending",
    successMessage: "Message sent. I'll get back to you shortly.",
    errorMessage:
      "That didn't send. Try again, or email me directly at business.zidanemz@gmail.com",
    cvLabel: "Download CV",
    cvNote: "PDF, updated from Notion",
  },
  nav: {
    items: [
      { label: "Work", href: "#projects" },
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  footer: {
    copyright: "© 2026 Maulana Zidane. Built with Next.js and Payload.",
    socials: [
      { label: "GitHub", href: "https://github.com/zdnemz" },
      { label: "LinkedIn", href: "https://linkedin.com/in/zdnemz" },
    ],
  },
  projectPage: {
    backLabel: "Back to projects",
    archiveEyebrow: "/ Archive",
    archiveHeading: "All projects",
    archiveIntro:
      "Systems I have built and shipped, from client automation to personal products.",
    printLabel: "Export portfolio PDF",
    emptyMessage: "No projects published yet",
    problemLabel: "The problem",
    roleLabel: "What I owned",
    outcomeLabel: "The outcome",
    timelineLabel: "Timeline",
    stackLabel: "Stack",
    liveLabel: "Live demo",
    codeLabel: "View code",
    galleryEmpty: "Screenshots for this project are not published yet.",
    metaClientLabel: "Client",
    metaTypeLabel: "Type",
    metaStatusLabel: "Status",
    backToProjectsLabel: "Back to all projects",
  },
  projectsPrint: {
    eyebrow: "/ Portfolio export",
    headline: "Selected work",
    profileHeading: "Profile",
    stackHeading: "Core stack",
    workHeading: "Selected work",
    footerNote:
      "Printed from zdnemz.vercel.app. In the print dialog choose Save as PDF and uncheck Headers and footers.",
  },
};

export const projectSeeds = [
  {
    title: "Intake automation for a fintech client",
    slug: "fintech-intake-automation",
    summary:
      "Replaced a spreadsheet-and-email intake process with a typed form, a validation pipeline, and a review queue the operations team runs without engineering help.",
    problem:
      "Every new merchant application arrived as an email attachment. Three operations staff retyped the same fields into a spreadsheet, then into the risk system, and reconciliation happened weekly. Typing errors surfaced days later and a single bad row could stall an application.",
    role:
      "Sole engineer. Mapped the existing process, designed the schema and validation rules, built the form and review queue, and wrote the import job that writes to the risk system. Trained the operations team on the review queue.",
    outcome:
      "Manual re-entry dropped from roughly 400 records a week to the exception cases only. Applications that used to sit for two days now reach review in minutes, and the weekly reconciliation job reports zero mismatches.",
    outcomeMetric: { value: 70, unit: "% less manual entry" },
    timeline: "3 weeks to first live slice, 6 weeks to full handover",
    stack: [
      { label: "Next.js" },
      { label: "Hono" },
      { label: "PostgreSQL" },
      { label: "Drizzle ORM" },
      { label: "Zod" },
    ],
    client: "Fintech client",
    status: "shipped" as const,
    projectType: "Workflow automation",
    startDate: "2025-02-03",
    endDate: "2025-03-21",
    featured: true,
    projectUrl: "",
    repositoryUrl: "",
    media: [],
  },
  {
    title: "Support assistant over internal documentation",
    slug: "support-assistant-rag",
    summary:
      "A retrieval assistant over the support team's own SOPs and product docs, with citations and role-based access, answering first-line questions before a ticket is opened.",
    problem:
      "A four-person support team answered the same thirty questions every week. The answers existed in scattered documents and a stale wiki, so new hires shadowed colleagues for a month before taking tickets alone. Search returned links, not answers.",
    role:
      "Sole engineer. Built the ingestion pipeline and chunking strategy, the pgvector retrieval layer, the evaluation set, and the API the help widget calls. Wrote the access rules that keep internal-only documents out of customer-facing answers.",
    outcome:
      "First response time on the covered question set fell from about 4 hours to under 90 seconds, and roughly 60 percent of incoming questions are answered without opening a ticket. Every answer carries the source document and page.",
    outcomeMetric: { value: 60, unit: "% of questions resolved without a ticket" },
    timeline: "5 weeks",
    stack: [
      { label: "PostgreSQL + pgvector" },
      { label: "OpenAI API" },
      { label: "Hono" },
      { label: "Next.js" },
      { label: "TypeScript" },
    ],
    client: "SaaS client",
    status: "shipped" as const,
    projectType: "AI assistant",
    startDate: "2025-06-02",
    endDate: "2025-07-04",
    featured: true,
    projectUrl: "",
    repositoryUrl: "",
    media: [],
  },
  {
    title: "Dispatch integration for a logistics operator",
    slug: "logistics-dispatch-integration",
    summary:
      "Connected a legacy dispatch system to a modern tracking API so status updates stop being phoned in and re-keyed by hand.",
    problem:
      "Dispatch status lived in a fifteen-year-old system with no API. Drivers called the office, an operator typed the update into the old system, then typed it again into a tracking portal the customers could see. A missed call meant a customer saw the wrong status for hours.",
    role:
      "Backend engineer on a two-person engagement. Designed the sync service and its retry semantics, wrote the adapters for both systems, and built the status dashboard the office uses.",
    outcome:
      "Status updates reach the customer portal in under a minute without an operator touching them. Retyping dropped to zero for the automated statuses, and the office reclaimed roughly two hours per dispatcher each day.",
    outcomeMetric: { value: 2, unit: " hours/day returned per dispatcher" },
    timeline: "4 weeks",
    stack: [
      { label: "TypeScript" },
      { label: "Hono" },
      { label: "PostgreSQL" },
      { label: "Redis" },
      { label: "Docker" },
    ],
    client: "Logistics operator",
    status: "shipped" as const,
    projectType: "System integration",
    startDate: "2024-09-09",
    endDate: "2024-10-04",
    featured: true,
    projectUrl: "",
    repositoryUrl: "",
    media: [],
  },
  {
    title: "ShardVeil — on-chain card game",
    slug: "shardveil-onchain-card-game",
    summary:
      "A trading-card game where card ownership and match results settle on-chain, with a Next.js client that stays playable on a phone.",
    problem:
      "Card ownership in digital TCGs is rented from the publisher: accounts get banned, marketplaces get shut down, and players own nothing. The design problem was making on-chain ownership invisible enough that a normal player never has to think about gas.",
    role:
      "Sole engineer. Wrote the Solidity contracts, the match and pack-opening contracts' test suite, the indexer that mirrors chain state into Postgres, and the playable client.",
    outcome:
      "Contracts deployed to testnet with full test coverage on pack opening and match settlement. The client plays a full match on a mid-range phone with the chain calls batched behind a single signature.",
    outcomeMetric: { value: 100, unit: "% of match results verifiable on-chain" },
    timeline: "Ongoing since February 2026",
    stack: [
      { label: "Solidity" },
      { label: "Hardhat" },
      { label: "OpenZeppelin" },
      { label: "Viem" },
      { label: "Next.js" },
      { label: "PostgreSQL" },
    ],
    client: "Self-initiated",
    status: "in-progress" as const,
    projectType: "Product",
    startDate: "2026-02-10",
    endDate: null,
    featured: false,
    projectUrl: "",
    repositoryUrl: "https://github.com/zdnemz",
    media: [],
  },
];

export const adminSeed = {
  email: process.env.SEED_ADMIN_EMAIL || "admin@zdnemz.dev",
  password: process.env.SEED_ADMIN_PASSWORD || "portfolio-dev-2026",
};
