"use client";

import * as React from "react";
import { ArrowUpRight, SendHorizonal, Download, FileText } from "lucide-react";
import { Container } from "@/components/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion-wrapper";
import { submitContact } from "@/app/(frontend)/contact-action";
import type { SiteContent } from "@/lib/cms/types";

type Status = "idle" | "sending" | "sent" | "error";

const Contact = React.forwardRef<HTMLElement, { site?: SiteContent }>(
  function Contact({ site }, ref) {
    const [data, setData] = React.useState({ name: "", email: "", message: "" });
    const [status, setStatus] = React.useState<Status>("idle");
    // Optional only for the pre-CMS home page S1 replaces.
    if (!site) return null;
    const copy = site.contact;
    const cvUrl = site.identity.cvUrl;

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("sending");

      try {
        const result = await submitContact(data);
        if (result.ok) {
          setStatus("sent");
          setData({ name: "", email: "", message: "" });
        } else {
          setStatus("error");
        }
      } catch {
        // The action never throws by contract; this is belt-and-braces so a
        // transport failure still lands on the visible error state.
        setStatus("error");
      }
    };

    return (
      <section id="contact" ref={ref} className="section-pad rule-top">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <span className="label-mono text-primary">{copy.eyebrow}</span>
              <h2 className="heading-section mt-3 max-w-[16ch]">{copy.heading}</h2>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-7 lg:pt-2">
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                {copy.intro}
              </p>
            </Reveal>
          </div>

          {/* Direct email — the path most recruiters actually take, so it leads */}
          <Reveal delay={0.16} className="mt-12">
            <a
              href={`mailto:${copy.email}`}
              className="group block border-2 border-border bg-card p-5 shadow-brutal transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="label-mono text-muted-foreground">
                  {copy.emailLabel}
                </span>
                <ArrowUpRight
                  className="size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden
                  strokeWidth={2.5}
                />
              </div>
              <span className="mt-3 block break-all font-display text-xl font-bold tracking-tight transition-colors duration-150 group-hover:text-primary sm:text-3xl lg:text-4xl">
                {copy.email}
              </span>
            </a>
          </Reveal>

          {/* Download CV — hidden until the CMS has a URL, so it can never hand
              a visitor a broken download. */}
          {cvUrl && (
            <Reveal delay={0.2} className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button asChild variant="outline" size="lg">
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                    <Download size={16} strokeWidth={2.5} />
                    {copy.cvLabel}
                  </a>
                </Button>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText size={13} strokeWidth={2.5} />
                  {copy.cvNote}
                </span>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.24} className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="label-mono text-muted-foreground">{copy.formEyebrow}</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="label-mono block text-foreground">
                    {copy.nameLabel}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={copy.namePlaceholder}
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="label-mono block text-foreground">
                    {copy.emailFieldLabel}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={copy.emailPlaceholder}
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="label-mono block text-foreground">
                  {copy.messageLabel}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder={copy.messagePlaceholder}
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
                  copy.sendingLabel
                ) : (
                  <>
                    {copy.submitLabel}{" "}
                    <SendHorizonal className="ml-1 size-4" strokeWidth={2.5} />
                  </>
                )}
              </Button>

              <div aria-live="polite">
                {status === "sent" && (
                  <div className="flex items-start gap-3 border-2 border-border bg-primary p-4 shadow-brutal-sm">
                    <span className="mt-1 size-2 shrink-0 bg-primary-foreground" aria-hidden />
                    <p className="text-sm font-medium text-primary-foreground">
                      {copy.successMessage}
                    </p>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-start gap-3 border-2 border-border bg-destructive p-4 shadow-brutal-sm">
                    <span className="mt-1 size-2 shrink-0 bg-destructive-foreground" aria-hidden />
                    <p className="text-sm font-medium text-destructive-foreground">
                      {copy.errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </Reveal>
        </Container>
      </section>
    );
  }
);

Contact.displayName = "Contact";
export default Contact;
