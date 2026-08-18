"use client";

import * as React from "react";
import { ArrowUpRight, SendHorizonal } from "lucide-react";
import { Container } from "@/components/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion-wrapper";

type Status = "idle" | "sending" | "sent" | "error";

const Contact = React.forwardRef<HTMLElement>((_, ref) => {
  const [data, setData] = React.useState({ name: "", email: "", message: "" });
  const [status, setStatus] = React.useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        setStatus("sent");
        setData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" ref={ref} className="section-pad rule-top">
      <Container>
        <Reveal>
          <h2 className="heading-section max-w-[16ch]">Open to new roles.</h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-muted-foreground">
            Available for full-time and contract fullstack work, plus select
            freelance projects. Based in Banjarmasin, Indonesia (UTC+8).
          </p>
        </Reveal>

        {/* Direct email is the path most recruiters actually take, so it leads */}
        <Reveal delay={0.16}>
          <a
            href="mailto:business.zidanemz@gmail.com"
            className="group mt-12 flex max-w-full items-baseline gap-2 font-display text-lg font-medium tracking-tight transition-colors duration-300 hover:text-primary sm:text-3xl lg:text-4xl"
          >
            <span className="min-w-0 break-all border-b border-border pb-1 transition-colors duration-300 group-hover:border-primary">
              business.zidanemz@gmail.com
            </span>
            <ArrowUpRight
              className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 sm:size-6 lg:size-7"
              aria-hidden
            />
          </a>
        </Reveal>

        <Reveal delay={0.24} className="mt-20">
          <p className="mb-8 text-sm text-muted-foreground">
            Or send it from here
          </p>

          <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Rangga Prasetya"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="rangga@company.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                placeholder="A little about the role or project."
                value={data.message}
                onChange={(e) => setData({ ...data, message: e.target.value })}
                required
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer sm:w-auto"
              disabled={status === "sending"}
            >
              {status === "sending" ? (
                "Sending"
              ) : (
                <>
                  Send message <SendHorizonal className="ml-1 size-4" />
                </>
              )}
            </Button>

            <div aria-live="polite">
              {status === "sent" && (
                <p className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                  Message sent. I&apos;ll get back to you shortly.
                </p>
              )}
              {status === "error" && (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  That didn&apos;t send. Try again, or email me directly at
                  business.zidanemz@gmail.com
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </Container>
    </section>
  );
});

Contact.displayName = "Contact";
export default Contact;
