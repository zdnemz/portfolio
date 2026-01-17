"use client";

import { FadeIn } from "@/components/ui/motion-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, SendHorizonal, MapPin, ArrowUpRight } from "lucide-react";
import * as React from "react";

const Contact = React.forwardRef<HTMLElement>((_, ref) => {
  const [data, setData] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        setData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-background overflow-hidden relative" ref={ref}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-5 gap-16 item-start">

          {/* Left Side: Info */}
          <FadeIn direction="right" className="md:col-span-2 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-4">
                <Mail size={16} />
                Contact
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Let’s build something <br />
                <span className="text-glow text-white">extraordinary.</span>
              </h2>
            </div>

            Whether you have a project in mind, need a frontend expert, or just want to say hi — I&apos;m always open to new ideas and collaborations.

            <div className="space-y-4 pt-4">
              <a href="mailto:zidanemz.freelance@gmail.com" className="flex items-center gap-4 group p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email me at</p>
                  <p className="font-medium text-foreground">zidanemz.freelance@gmail.com</p>
                </div>
                <ArrowUpRight className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" size={20} />
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Based in</p>
                  <p className="font-medium text-foreground">Banjarmasin, Indonesia (UTC+8)</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right Side: Form */}
          <FadeIn direction="left" delay={0.2} className="md:col-span-3">
            <div className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden">
              <form onSubmit={onSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium ml-1">Name</label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      required
                      className="rounded-xl h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium ml-1">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      required
                      className="rounded-xl h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium ml-1">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={6}
                    value={data.message}
                    onChange={(e) => setData({ ...data, message: e.target.value })}
                    required
                    className="rounded-xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <SendHorizonal className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {submitted && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-center text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                    Message sent successfully! I&apos;ll get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
})

Contact.displayName = "Contact";
export default Contact;

