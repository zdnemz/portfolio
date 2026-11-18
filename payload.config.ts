import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

import { Users } from "./src/collections/Users";
import { Projects } from "./src/collections/Projects";
import { Media } from "./src/collections/Media";
import { ContactSubmissions } from "./src/collections/ContactSubmissions";
import { Site } from "./src/globals/Site";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "insecure-dev-secret",
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(dirname, "src"),
    },
  },
  serverURL:
    process.env.NEXT_PUBLIC_SERVER_URL || "https://zdnemz.vercel.app",
  collections: [Users, Projects, Media, ContactSubmissions],
  globals: [Site],
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  bin: [{ scriptPath: "scripts/seed.ts", key: "seed" }],
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
});
