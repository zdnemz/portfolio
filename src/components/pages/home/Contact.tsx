"use client";

import { motion } from "framer-motion";
import { Container } from "../../container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, SendHorizonal } from "lucide-react";
import * as React from "react";

export default function Contact() {
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
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      <Container>
        <div className="grid md:grid-cols-5 gap-16 items-start">
          {/* Left Side: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide">
              <Mail size={18} />
              Get in Touch
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Let’s work on something great.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Have an idea or a collaboration in mind? Reach out and let’s build
              something that matters.
            </p>

            <div className="text-sm text-muted-foreground">
              Or email me directly at{" "}
              <a
                href="mailto:zidanemz.freelance@gmail.com"
                className="underline underline-offset-4 hover:text-foreground"
              >
                zidanemz.freelance@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-3 bg-muted/10 backdrop-blur-md border border-border rounded-2xl p-8 space-y-6 shadow-lg"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
                className="rounded-xl bg-background/60 focus-visible:ring-1"
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
                className="rounded-xl bg-background/60 focus-visible:ring-1"
              />
            </div>
            <Textarea
              placeholder="Your Message"
              rows={5}
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              required
              className="rounded-xl bg-background/60 focus-visible:ring-1 max-h-48"
            />
            <Button
              type="submit"
              size="lg"
              className="w-full group inline-flex items-center justify-center gap-2 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <SendHorizonal className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            {submitted && (
              <p className="text-green-600 text-sm text-center">
                Message sent successfully!
              </p>
            )}
          </motion.form>
        </div>
      </Container>

      {/* Background Accent Blur Circle */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
    </motion.section>
  );
}
