import Hero from "@/components/pages/home/Hero";
import Stats from "@/components/pages/home/Stats";
import Projects from "@/components/pages/home/Projects";
import Services from "@/components/pages/home/Services";
import Process from "@/components/pages/home/Process";
import About from "@/components/pages/home/About";
import Testimonials from "@/components/pages/home/Testimonials";
import GitHubActivity from "@/components/pages/home/GitHubActivity";
import Faq from "@/components/pages/home/Faq";
import Now from "@/components/pages/home/Now";
import Contact from "@/components/pages/home/Contact";
import { getSite } from "@/lib/cms/get-site";
import { getFeaturedProjects } from "@/lib/cms/get-projects";
import { getGithubEvents, type GithubEvent } from "@/lib/github";

// The home page reads the CMS on every request so an edit lands without a
// rebuild.
export const dynamic = "force-dynamic";

/**
 * Home is a Server Component: all content is in the first HTML byte, which is
 * what crawlers and link previews see. The layout owns `<main id="main-content">`
 * so this returns a fragment.
 *
 * GitHub is live third-party data, not CMS content — a failure there must not
 * take the page down, so it degrades to "nothing to show".
 */
export default async function HomePage() {
  const [site, projects] = await Promise.all([
    getSite(),
    getFeaturedProjects(3),
  ]);

  let events: GithubEvent[] = [];
  try {
    events = await getGithubEvents();
  } catch {
    // GitHub outage or rate limit: the section renders its empty state.
  }

  return (
    <>
      <Hero site={site} />
      <Stats site={site} />
      <Projects site={site} projects={projects} />
      <Services site={site} />
      <Process site={site} />
      <About site={site} />
      <Testimonials site={site} />
      <GitHubActivity site={site} events={events} />
      <Faq site={site} />
      <Now site={site} />
      <Contact site={site} />
    </>
  );
}
