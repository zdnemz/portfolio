"use client";

import * as React from "react";
import { ArrowUpRight, SendHorizonal, Download, FileText } from "lucide-react";
import { Container } from "@/components/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion-wrapper";

type Status = "idle" | "sending" | "sent" | "error";

const Contact = React.forwardRef<HTMLElement>((_, ref) => {
  const [data, setData] = React.useState({ name: "", email: "", message: "" });
  const [status, setStatus] = React.useState<Status>("idle");
  const [cvUrl, setCvUrl] = React.useState<string | null>(null);

  // The CV lives in Notion so it can be swapped without a deploy. Its URL is
  // signed and short-lived, which is why it is fetched per visit rather than
  // baked into the page.
  React.useEffect(() => {
    let active = true;
    fetch("/api/cv")
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) throw new Error("no cv");
        return json.data?.url as string | undefined;
      })
      .then((url) => {
        if (active && url) setCvUrl(url);
      })
      .catch(() => {
        // No CV uploaded yet — the button simply does not render.
      });
    return () => {
      active = false;
    };
  }, []);

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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <span className="label-mono text-primary">/ Contact</span>
            <h2 className="heading-section mt-3 max-w-[16ch]">Open to new roles.</h2>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7 lg:pt-2">
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Available for full-time and contract fullstack work, plus select
              freelance projects. Based in Banjarmasin, Indonesia (UTC+8).
            </p>
          </Reveal>
        </div>

        {/* Direct email — the path most recruiters actually take, so it leads */}
        <Reveal delay={0.16} className="mt-12">
          <a
            href="mailto:business.zidanemz@gmail.com"
            className="group block border-2 border-border bg-card p-5 shadow-brutal transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="label-mono text-muted-foreground">/ Direct email</span>
              <ArrowUpRight
                className="size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden
                strokeWidth={2.5}
              />
            </div>
            <span className="mt-3 block break-all font-display text-xl font-bold tracking-tight transition-colors duration-150 group-hover:text-primary sm:text-3xl lg:text-4xl">
              business.zidanemz@gmail.com
            </span>
          </a>
        </Reveal>

        {/* Download CV — the real PDF from Notion. The button stays hidden
            until a file is actually uploaded there, so it can never hand a
            visitor a broken download. */}
        {cvUrl && (
          <Reveal delay={0.2} className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button asChild variant="outline" size="lg">
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  <Download size={16} strokeWidth={2.5} />
                  Download CV
                </a>
              </Button>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText size={13} strokeWidth={2.5} />
                PDF, updated from Notion
              </span>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.24} className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="label-mono text-muted-foreground">/ Or send it from here</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="label-mono block text-foreground">
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
                <label htmlFor="email" className="label-mono block text-foreground">
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
              <label htmlFor="message" className="label-mono block text-foreground">
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
                  Send message <SendHorizonal className="ml-1 size-4" strokeWidth={2.5} />
                </>
              )}
            </Button>

            <div aria-live="polite">
              {status === "sent" && (
                <div className="flex items-start gap-3 border-2 border-border bg-primary p-4 shadow-brutal-sm">
                  <span className="mt-1 size-2 shrink-0 bg-primary-foreground" aria-hidden />
                  <p className="text-sm font-medium text-primary-foreground">
                    Message sent. I&rsquo;ll get back to you shortly.
                  </p>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-start gap-3 border-2 border-border bg-destructive p-4 shadow-brutal-sm">
                  <span className="mt-1 size-2 shrink-0 bg-destructive-foreground" aria-hidden />
                  <p className="text-sm font-medium text-destructive-foreground">
                    That didn&rsquo;t send. Try again, or email me directly at
                    business.zidanemz@gmail.com
                  </p>
                </div>
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
