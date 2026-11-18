import type { Access, CollectionConfig } from "payload";

const loggedIn: Access = ({ req }) => Boolean(req.user);

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    create: loggedIn,
    read: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [],
};
