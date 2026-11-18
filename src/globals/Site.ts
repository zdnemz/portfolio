import type { GlobalConfig } from "payload";

/**
 * Single source of truth for every string the marketing pages render.
 * Field names are a shared contract with the UI tasks — do not rename.
 */
export const Site: GlobalConfig = {
  slug: "site",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      // Payload's named groups are required to keep admin sections distinct
      type: "group",
      name: 'seo',
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "keywords", type: "text" },
        { name: "ogImageUrl", type: "text" },
      ],
    },
    {
      type: "group",
      name: 'identity',
      fields: [
        { name: "name", type: "text" },
        { name: "role", type: "text" },
        { name: "tagline", type: "textarea" },
        { name: "location", type: "text" },
        { name: "timezone", type: "text" },
        { name: "email", type: "text" },
        { name: "availabilityLabel", type: "text" },
        { name: "available", type: "checkbox", defaultValue: true },
        { name: "localTimeZone", type: "text" },
        { name: "cvUrl", type: "text" },
        { name: "initials", type: "text" },
        { name: "wordmark", type: "text" },
        { name: "wordmarkAccent", type: "text" },
      ],
    },
    {
      type: "group",
      name: 'hero',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "headlineAccent", type: "text" },
        { name: "intro", type: "textarea" },
        { name: "primaryCta", type: "text" },
        { name: "secondaryCta", type: "text" },
        {
          name: "marquee",
          type: "array",
          fields: [{ name: "label", type: "text" }],
        },
      ],
    },
    {
      type: "group",
      name: 'stats',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "note", type: "text" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "value", type: "number" },
            { name: "suffix", type: "text" },
            { name: "label", type: "text" },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'projectsSection',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "heading", type: "text" },
        { name: "browseLabel", type: "text" },
        { name: "emptyMessage", type: "textarea" },
        { name: "errorMessage", type: "textarea" },
        { name: "inProgressLabel", type: "text" },
      ],
    },
    {
      type: "group",
      name: 'services',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "heading", type: "text" },
        { name: "intro", type: "textarea" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "title", type: "text" },
            { name: "description", type: "textarea" },
            {
              name: "tools",
              type: "array",
              fields: [{ name: "label", type: "text" }],
            },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'process',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "heading", type: "text" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "title", type: "text" },
            { name: "description", type: "textarea" },
            {
              name: "tools",
              type: "array",
              fields: [{ name: "label", type: "text" }],
            },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'about',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "heading", type: "text" },
        { name: "bio", type: "textarea" },
        { name: "stackEyebrow", type: "text" },
        { name: "stackNote", type: "text" },
        {
          name: "groups",
          type: "array",
          fields: [
            { name: "title", type: "text" },
            {
              name: "span",
              type: "select",
              defaultValue: "3",
              options: [
                { label: "3 columns", value: "3" },
                { label: "4 columns", value: "4" },
                { label: "2 columns", value: "2" },
              ],
            },
            {
              name: "items",
              type: "array",
              fields: [{ name: "label", type: "text" }],
            },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'testimonials',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "heading", type: "text" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "quote", type: "textarea" },
            { name: "name", type: "text" },
            { name: "role", type: "text" },
            { name: "company", type: "text" },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'github',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "heading", type: "text" },
        { name: "profileLabel", type: "text" },
        { name: "profileUrl", type: "text" },
        { name: "emptyMessage", type: "textarea" },
      ],
    },
    {
      type: "group",
      name: 'faq',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "heading", type: "text" },
        { name: "intro", type: "textarea" },
        { name: "contactPrompt", type: "text" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "question", type: "text" },
            { name: "answer", type: "textarea" },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'now',
      fields: [
        { name: "eyebrow", type: "text" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "label", type: "text" },
            { name: "value", type: "text" },
            {
              name: "kind",
              type: "select",
              defaultValue: "text",
              options: [
                { label: "Text", value: "text" },
                { label: "Clock", value: "clock" },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'contact',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "heading", type: "text" },
        { name: "intro", type: "textarea" },
        { name: "emailLabel", type: "text" },
        { name: "email", type: "text" },
        { name: "formEyebrow", type: "text" },
        { name: "nameLabel", type: "text" },
        { name: "namePlaceholder", type: "text" },
        { name: "emailFieldLabel", type: "text" },
        { name: "emailPlaceholder", type: "text" },
        { name: "messageLabel", type: "text" },
        { name: "messagePlaceholder", type: "text" },
        { name: "submitLabel", type: "text" },
        { name: "sendingLabel", type: "text" },
        { name: "successMessage", type: "textarea" },
        { name: "errorMessage", type: "textarea" },
        { name: "cvLabel", type: "text" },
        { name: "cvNote", type: "text" },
      ],
    },
    {
      type: "group",
      name: 'nav',
      fields: [
        {
          name: "items",
          type: "array",
          fields: [
            { name: "label", type: "text" },
            { name: "href", type: "text" },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'footer',
      fields: [
        { name: "copyright", type: "text" },
        {
          name: "socials",
          type: "array",
          fields: [
            { name: "label", type: "text" },
            { name: "href", type: "text" },
          ],
        },
      ],
    },
    {
      type: "group",
      name: 'projectPage',
      fields: [
        { name: "backLabel", type: "text" },
        { name: "archiveEyebrow", type: "text" },
        { name: "archiveHeading", type: "text" },
        { name: "archiveIntro", type: "textarea" },
        { name: "printLabel", type: "text" },
        { name: "emptyMessage", type: "textarea" },
        { name: "problemLabel", type: "text" },
        { name: "roleLabel", type: "text" },
        { name: "outcomeLabel", type: "text" },
        { name: "timelineLabel", type: "text" },
        { name: "stackLabel", type: "text" },
        { name: "liveLabel", type: "text" },
        { name: "codeLabel", type: "text" },
        { name: "galleryEmpty", type: "textarea" },
        { name: "metaClientLabel", type: "text" },
        { name: "metaTypeLabel", type: "text" },
        { name: "metaStatusLabel", type: "text" },
        { name: "backToProjectsLabel", type: "text" },
      ],
    },
    {
      type: "group",
      name: 'projectsPrint',
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "profileHeading", type: "text" },
        { name: "stackHeading", type: "text" },
        { name: "workHeading", type: "text" },
        { name: "footerNote", type: "textarea" },
      ],
    },
  ],
};
