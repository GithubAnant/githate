"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function BackgroundLines() {
    const linesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!linesRef.current) return;
        const lines = linesRef.current.children;

        gsap.fromTo(
            lines,
            { scaleY: 0, opacity: 0 },
            {
                scaleY: 1,
                opacity: 0.15,
                duration: 2,
                stagger: 0.2,
                ease: "power3.inOut",
            }
        );
    }, []);

    return (
        <div
            ref={linesRef}
            className="fixed inset-0 -z-10 flex justify-between px-20 pointer-events-none opacity-50 overflow-hidden"
        >
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/50 to-transparent origin-top"
                />
            ))}
        </div>
    );
}
