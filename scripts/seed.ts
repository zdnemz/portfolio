/**
 * `npx payload seed`
 *
 * Idempotent: running it twice must not duplicate anything. Projects upsert by
 * their unique slug, the site global is a straight update, and the admin user
 * is only created when the email is not taken.
 */
import { getPayload } from "payload";
import type { SanitizedConfig } from "payload";

import { adminSeed, projectSeeds, siteSeed } from "../src/seed/defaults";

export const script = async (config: SanitizedConfig): Promise<void> => {
  const payload = await getPayload({ config });

  payload.logger.info("Seeding site global");
  await payload.updateGlobal({ slug: "site", data: siteSeed as never });
  payload.logger.info("Site global updated");

  for (const project of projectSeeds) {
    const existing = await payload.find({
      collection: "projects",
      where: { slug: { equals: project.slug } },
      limit: 1,
      depth: 0,
    });

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "projects",
        id: existing.docs[0].id,
        data: project,
      });
      payload.logger.info(`Project updated: ${project.slug}`);
      continue;
    }

    await payload.create({ collection: "projects", data: project });
    payload.logger.info(`Project created: ${project.slug}`);
  }

  const admin = await payload.find({
    collection: "users",
    where: { email: { equals: adminSeed.email } },
    limit: 1,
    depth: 0,
  });

  if (admin.docs.length === 0) {
    await payload.create({
      collection: "users",
      data: adminSeed,
    });
    payload.logger.info(`Admin user created: ${adminSeed.email}`);
  } else {
    payload.logger.info(`Admin user already exists: ${adminSeed.email}`);
  }

  payload.logger.info("Seed complete");
  await payload.destroy();
};
