import type { Access, CollectionConfig } from "payload";

const loggedIn: Access = ({ req }) => Boolean(req.user);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc.externalUrl) doc.url = doc.externalUrl;
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      // Production images live on an external CDN, so this wins over the
      // built-in `url` field whenever it is set.
      name: "externalUrl",
      type: "text",
    },
  ],
};
