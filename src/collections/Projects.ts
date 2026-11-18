import type { Access, CollectionConfig } from "payload";

const loggedIn: Access = ({ req }) => Boolean(req.user);
const anyone: Access = () => true;

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "featured", "updatedAt"],
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "summary", type: "textarea" },
    { name: "problem", type: "textarea" },
    { name: "role", type: "textarea" },
    { name: "outcome", type: "textarea" },
    {
      name: "outcomeMetric",
      type: "group",
      fields: [
        { name: "value", type: "number" },
        { name: "unit", type: "text" },
      ],
    },
    { name: "timeline", type: "text" },
    {
      name: "stack",
      type: "array",
      fields: [{ name: "label", type: "text" }],
    },
    { name: "client", type: "text" },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Shipped", value: "shipped" },
        { label: "In progress", value: "in-progress" },
        { label: "Archived", value: "archived" },
      ],
      defaultValue: "shipped",
    },
    { name: "projectType", type: "text" },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "projectUrl", type: "text" },
    { name: "repositoryUrl", type: "text" },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
  ],
};
