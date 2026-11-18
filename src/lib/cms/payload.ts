import { getPayload, type Payload } from "payload";

import config from "@payload-config";

/**
 * One Payload instance per process. `getPayload` already caches on the global
 * scope, but memoising the promise here keeps every caller in this module on
 * the same in-flight initialisation.
 *
 * Nothing connects at import time: the config is a promise and the database
 * adapter opens its pool on the first query, so importing this file with no
 * DATABASE_URI is safe.
 */
let client: Promise<Payload> | null = null;

export async function getPayloadClient(): Promise<Payload> {
  if (!client) {
    client = getPayload({ config });
    // Do not cache a failed init: a database that is briefly down must not
    // poison every later request with the same rejected promise.
    client.catch(() => {
      client = null;
    });
  }

  return client;
}
