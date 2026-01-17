import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/notion/projects";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar, CheckCircle2 } from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/ui/motion-wrapper";
import { Metadata } from "next";

// Force dynamic since we're fetching from a DB that might update
export const dynamic = "force-dynamic";

interface PageProps {
   params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
   const { id } = await params;
   const project = await getProjectById(id);

   if (!project) return { title: "Project Not Found" };

   return {
      title: `${project.name} | Zidane Portfolio`,
      description: project.description.slice(0, 160),
   };
}

export default async function ProjectPage({ params }: PageProps) {
   const { id } = await params;
   // Note: In a real app we might want to fetch by slug, but ID is what we have structure for now
   const project = await getProjectById(id);

   if (!project) {
      notFound();
   }

   return (
      <article className="min-h-screen py-24 md:py-32">
         {/* Background */}
         <div className="fixed inset-0 pointer-events-none -z-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
         </div>

         <Container className="max-w-5xl">
            <FadeIn>
               <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
                  <ArrowLeft size={20} /> Back to Projects
               </Link>
            </FadeIn>

            <StaggerContainer className="space-y-12">
               {/* Header */}
               <div className="space-y-6">
                  <FadeIn>
                     <div className="flex flex-wrap gap-3 mb-4">
                        {project.technologies.map(tech => (
                           <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary border-primary/20">{tech}</Badge>
                        ))}
                     </div>
                     <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">{project.name}</h1>
                     <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">{project.description}</p>
                  </FadeIn>

                  <FadeIn delay={0.2} className="flex flex-wrap gap-4 pt-4">
                     {project.projectUrl && (
                        <Button asChild size="lg" className="rounded-full">
                           <Link href={project.projectUrl} target="_blank">
                              Live Demo <ExternalLink className="ml-2 w-4 h-4" />
                           </Link>
                        </Button>
                     )}
                     {project.repositoryUrl && (
                        <Button asChild variant="outline" size="lg" className="rounded-full">
                           <Link href={project.repositoryUrl} target="_blank">
                              View Code <Github className="ml-2 w-4 h-4" />
                           </Link>
                        </Button>
                     )}
                  </FadeIn>
               </div>

               {/* Hero Image */}
               <FadeIn delay={0.3} className="relative aspect-video w-full rounded-3xl overflow-hidden glass-card shadow-2xl">
                  {project.image ? (
                     <Image src={project.image} alt={project.name} fill className="object-cover" priority />
                  ) : (
                     <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Preview Available</div>
                  )}
               </FadeIn>

               {/* Details Grid */}
               <div className="grid md:grid-cols-3 gap-12">
                  {/* Left: Meta Info */}
                  <FadeIn delay={0.4} className="md:col-span-1 space-y-8 p-6 glass-card rounded-2xl h-fit">
                     <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Project Type</h4>
                        <p className="font-medium text-lg">{project.projectType || "Personal Project"}</p>
                     </div>
                     <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Completion</h4>
                        <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-primary" />
                           <p className="font-medium">{project.completionDate || "Ongoing"}</p>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Client</h4>
                        <p className="font-medium">{project.client || "Self-Initiated"}</p>
                     </div>
                  </FadeIn>

                  {/* Right: Key Learnings / Content */}
                  <FadeIn delay={0.5} className="md:col-span-2 space-y-6">
                     <h3 className="text-2xl font-bold">Key Challenges & Learnings</h3>
                     {project.keyLearnings ? project.keyLearnings.split(",").map((learning, index) => (
                        <div className="flex gap-4" key={index}>
                           <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                           <p className="text-muted-foreground">{learning}</p>
                        </div>
                     )) : (
                        <div className="space-y-4">
                           <div className="flex gap-4">
                              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                              <p className="text-muted-foreground">Implemented advanced responsive design patterns ensuring compatibility across all devices.</p>
                           </div>
                           <div className="flex gap-4">
                              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                              <p className="text-muted-foreground">Optimized performance using modern caching strategies and lazy loading.</p>
                           </div>
                        </div>
                     )}
                  </FadeIn>
               </div>
            </StaggerContainer>
         </Container>
      </article>
   );
}
