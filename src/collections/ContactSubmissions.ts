import type { CollectionConfig } from "payload";

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  timestamps: true,
  access: {
    // The public contact form posts here.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "read", "createdAt"],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "text", required: true },
    { name: "message", type: "textarea", required: true },
    { name: "read", type: "checkbox", defaultValue: false },
  ],
};
