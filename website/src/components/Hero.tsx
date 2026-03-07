"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            // Pure fade-in reveal, no extravagant blur/scale
            tl.fromTo(
                ".reveal-text",
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="pt-32 pb-6 w-full flex flex-col items-start text-left">
            <div className="reveal-text flex items-center gap-3 mb-8">
                <span className="bg-white text-black text-[12px] font-mono font-medium px-2 py-0.5">
                    New
                </span>
                <span className="text-neutral-400 text-[14px] font-mono tracking-tight">
                    Desktop app available in beta on macOS, Windows, and Linux. <a href="https://github.com/GithubAnant/githate" target="_blank" className="text-neutral-500 hover:text-white transition-colors">Download now</a>
                </span>
            </div>

            <h1 className="reveal-text text-4xl md:text-5xl font-mono font-bold tracking-tight mb-6">
                <span className="text-white">The open source GitHub</span>
                <br />
                <span className="text-white mt-2 inline-block">follower tracking agent</span>
            </h1>

            <p className="reveal-text text-[15px] font-mono text-neutral-400 max-w-2xl leading-relaxed mt-2">
                A fast, privacy-first CLI tool that diffs your GitHub followers,
                <br />
                reveals the haters, and requires no databases.
            </p>
        </section>
    );
}
