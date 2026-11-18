import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";

import { Users } from "./src/collections/Users";
import { Projects } from "./src/collections/Projects";
import { Media } from "./src/collections/Media";
import { ContactSubmissions } from "./src/collections/ContactSubmissions";
import { Site } from "./src/globals/Site";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const publicUrl = process.env.S3_PUBLIC_URL;

export default buildConfig({
  // Build-time fallback only. Production must always set PAYLOAD_SECRET.
  secret:
    process.env.PAYLOAD_SECRET || "insecure-build-time-secret-set-PAYLOAD_SECRET",
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
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: {
        media: publicUrl
          ? {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) => {
                const key = prefix ? `${prefix}/${filename}` : filename;
                return `${publicUrl}/${key}`;
              },
            }
          : true,
      },
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      },
    }),
  ],
});
