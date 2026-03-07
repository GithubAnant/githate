"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ParallaxVideo() {
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!videoContainerRef.current || !videoRef.current) return;

        // Reveal animation
        gsap.fromTo(
            videoContainerRef.current,
            { y: 100, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: videoContainerRef.current,
                    start: "top 80%",
                },
            }
        );

        // Parallax effect
        gsap.fromTo(
            videoRef.current,
            { y: -50 },
            {
                y: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: videoContainerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section className="py-12 w-full max-w-6xl mx-auto">
            <div
                ref={videoContainerRef}
                className="relative aspect-video rounded-sm overflow-hidden group"
            >
                {/* Placeholder text while video is loading/missing */}
                <div className="absolute inset-0 flex items-center justify-center text-[#555555] font-mono text-sm z-0">
                    Video Placeholder (Replace with actual src)
                </div>

                <video
                    ref={videoRef}
                    className="w-full h-[120%] object-cover absolute top-[-10%] z-0"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/githate.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </section>
    );
}
