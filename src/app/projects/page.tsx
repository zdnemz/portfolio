import { getProjects } from "@/lib/notion/projects";
import { Container } from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import { FadeIn, StaggerContainer } from "@/components/ui/motion-wrapper";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Projects | Zidane Portfolio",
  description: "Browse my complete collection of frontend development projects.",
};

export default async function ProjectsPage() {
  // Fetch all projects (limit 100 for now)
  const projects = await getProjects({ limit: 100 });

  return (
    <main className="min-h-screen py-24 md:py-32 px-6">
       {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <Container>
        <FadeIn className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft size={20} /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Projects</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A collection of my work, experiments, and open source contributions.
            </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
                <FadeIn key={project.id} className="h-full">
                    <Link href={`/projects/${project.id}`} className="block h-full group">
                        <div className="relative h-full glass-card rounded-2xl overflow-hidden hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 flex flex-col">
                             {/* Image */}
                             <div className="relative w-full aspect-video overflow-hidden bg-muted">
                                 {project.image ? (
                                     <Image 
                                        src={project.image} 
                                        alt={project.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                     />
                                 ) : (
                                     <div className="flex items-center justify-center h-full text-muted-foreground">No Preview</div>
                                 )}
                                 <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
                             </div>

                             {/* Content */}
                             <div className="p-6 flex flex-col flex-grow space-y-4">
                                 <div>
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{project.description}</p>
                                 </div>
                                 <div className="mt-auto flex flex-wrap gap-2">
                                     {project.technologies.slice(0, 3).map(tech => (
                                         <span key={tech} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
                                             {tech}
                                         </span>
                                     ))}
                                     {project.technologies.length > 3 && (
                                         <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
                                            +{project.technologies.length - 3}
                                         </span>
                                     )}
                                 </div>
                             </div>
                        </div>
                    </Link>
                </FadeIn>
            ))}
        </StaggerContainer>
      </Container>
    </main>
  );
}
