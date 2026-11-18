/**
 * Action-level test for the public contact form sink.
 *
 * The REST round-trip in integration-gate.sh proves public `create` access,
 * but it bypasses submitContact entirely. This script calls the REAL action
 * and checks its validation and write behaviour, using Payload's local API
 * for observation (no HTTP server, no JWT juggling).
 *
 * Run from the repo root with .env.local sourced:
 *   set -a; . ./.env.local; set +a
 *   node --import tsx scripts/test-contact-action.ts
 */
import assert from "node:assert/strict";

import { submitContact } from "../src/app/(frontend)/contact-action";
import { getPayloadClient } from "../src/lib/cms/payload";

if (!process.env.DATABASE_URI) {
  console.error("FAIL env DATABASE_URI is unset — source .env.local before running");
  process.exit(1);
}
if (!process.env.PAYLOAD_SECRET) {
  console.error("FAIL env PAYLOAD_SECRET is unset — source .env.local before running");
  process.exit(1);
}

const COLLECTION = "contact-submissions";
const TEST_EMAIL = "gate-action@example.com";

let failed = 0;
const pass = (name: string) => console.log(`PASS ${name}`);
const fail = (name: string, detail: string) => {
  console.error(`FAIL ${name} ${detail}`);
  failed += 1;
};

async function check(name: string, fn: () => unknown | Promise<unknown>) {
  try {
    await fn();
    pass(name);
  } catch (error) {
    fail(name, error instanceof Error ? error.message : String(error));
  }
}

type ContactInput = Parameters<typeof submitContact>[0];

async function main() {
  const payload = await getPayloadClient();
  const count = async () => (await payload.count({ collection: COLLECTION })).totalDocs;
  const before = await count();
  let createdId: string | undefined;

  try {
    // 1. Null input must never throw — the action guards every field.
    await check("null input never throws", async () => {
      const input = { name: null, email: null, message: null } as unknown as ContactInput;
      assert.deepEqual(await submitContact(input), { ok: false });
    });

    // 2. Whitespace-only required fields are rejected.
    await check("empty fields rejected", async () => {
      const input = {
        name: "   ",
        email: "a@b.co",
        message: "   ",
      } as unknown as ContactInput;
      assert.deepEqual(await submitContact(input), { ok: false });
    });

    // 3. A syntactically broken address is rejected.
    await check("malformed email rejected", async () => {
      assert.deepEqual(
        await submitContact({ name: "A", email: "not-an-email", message: "hello" }),
        { ok: false },
      );
    });

    // 4. Every rejected case above must leave the collection untouched.
    await check("rejections have no side effects", async () => {
      assert.equal(await count(), before, "submission count changed after a rejected input");
    });

    // 5. A valid payload is accepted.
    await check("valid payload succeeds", async () => {
      assert.deepEqual(
        await submitContact({
          name: "  Gate Action Bot  ",
          email: "  gate-action@example.com  ",
          message: "  action-level check  ",
        }),
        { ok: true },
      );
    });

    // 6. The stored document carries the trimmed values the action validated.
    await check("persistence trims fields", async () => {
      const found = await payload.find({
        collection: COLLECTION,
        where: { email: { equals: TEST_EMAIL } },
        sort: "-createdAt",
        limit: 1,
        depth: 0,
      });
      const doc = found.docs[0];
      assert.ok(doc, "no submission stored for the test email");
      createdId = String(doc.id);
      assert.equal(doc.name, "Gate Action Bot", "name was not trimmed on write");
      assert.equal(doc.email, TEST_EMAIL, "email was not trimmed on write");
      assert.equal(doc.message, "action-level check", "message was not trimmed on write");
    });
  } finally {
    // 7. Remove the row created in case 5 so repeated gate runs do not pile up.
    await check("cleanup", async () => {
      if (createdId) {
        await payload.delete({ collection: COLLECTION, id: createdId });
      }
      assert.equal(await count(), before, "submission count did not return to baseline");
    });
  }
}

main()
  .then(() => {
    if (failed) process.exit(1);
    console.log("CONTACT ACTION TEST PASS");
  })
  .catch((error) => {
    console.error("FAIL unexpected", error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
