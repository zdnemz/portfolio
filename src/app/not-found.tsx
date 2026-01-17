"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion-wrapper";

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-background">
            {/* Background distortion */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[150px]" />
            </div>

            <FadeIn className="relative z-10 space-y-6">
                <h1 className="text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/5 select-none animate-pulse">
                    404
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold">
                    Signal <span className="text-primary">Lost</span>
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                    The coordinates you entered led to an empty void.
                    Let&apos;s get you back to familiar territory.
                </p>

                <div className="pt-8">
                    <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                        <Link href="/">Return to Base</Link>
                    </Button>
                </div>
            </FadeIn>
        </div>
    );
}
