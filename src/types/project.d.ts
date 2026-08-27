export type Project = {
  id: string;
  name: string;
  description: string;
  client: string;
  status: string;
  projectType: string | null;
  technologies: string[];
  keyLearnings: string;
  startDate: string | null;
  completionDate: string | null;
  featured: boolean;
  projectUrl: string | null;
  repositoryUrl: string | null;
  /** Every file on the Notion "Mockup Image" property, in Notion's order. */
  images: string[];
};
