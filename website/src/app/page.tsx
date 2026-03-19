"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SocialLink } from "../components/SocialLink";

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [pkgManager, setPkgManager] = useState<"npm" | "pnpm" | "bun" | "yarn" | "brew">("npm");
  const [copied, setCopied] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const commandText =
    pkgManager === "npm" ? "npm i -g githate" :
      pkgManager === "yarn" ? "yarn global add githate" :
        pkgManager === "pnpm" ? "pnpm add -g githate" :
          pkgManager === "bun" ? "bun add -g githate" :
            "brew install GithubAnant/githate/githate";

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (videoContainerRef.current) {
        const rect = videoContainerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen relative flex flex-col items-center overflow-x-hidden selection:bg-white/20 bg-black font-sans">

      {/* Navigation */}
      <nav className="w-full px-12 py-8 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2.5 w-1/3">
          <Image src="/githate.png" alt="githate logo" width={30} height={30} className="rounded-md" />
          <span className="text-[22px] font-semibold tracking-tight text-white leading-none" style={{ fontFamily: "var(--font-geist-mono)" }}>
            githate
          </span>
        </div>
        <div className="flex justify-center items-center gap-10 text-[15px] w-1/3" style={{ fontFamily: "var(--font-geist-mono)" }}>
          <a
            href="https://github.com/GithubAnant/githate"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Github
          </a>
          <a
            href="https://www.npmjs.com/package/githate"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            NPMJS
          </a>
        </div>
        <div className="w-1/3"></div>
      </nav>

      {/* Hero Section */}
      <section className="w-full px-6 mt-16 md:mt-24 flex flex-col items-center text-center z-10">
        <h1
          className="text-6xl md:text-[110px] tracking-tight leading-[0.95] text-white"
          style={{ fontFamily: "var(--font-instrument)" }}
        >
          Track your<br />
          biggest haters
        </h1>
        <p className="mt-8 text-[#989898] max-w-[600px] mx-auto text-xl md:text-[22px] leading-relaxed font-light">
          The best CLI tool to find out who unfollowed you on GitHub.
        </p>
      </section>

      {/* Code Snippet & Video Section */}
      <section className="w-full px-6 mt-16 md:mt-24 mb-32 z-10 relative">
        {/* Background Hazes Moved Here */}
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[600px] bg-[#00b8d4]/25 blur-[140px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[600px] bg-[#ff7b00]/25 blur-[140px] rounded-full pointer-events-none z-0" />

        {/* Code Snippet Component */}
        <div className="max-w-[500px] mx-auto mb-16 relative z-10">
          <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0a0a]">
              <div className="flex gap-2">
                {(["npm", "pnpm", "bun", "yarn", "brew"] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPkgManager(pm)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${pkgManager === pm
                      ? "bg-[#e5e5e5] text-black font-medium"
                      : "bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#27272a] hover:text-white"
                      }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="p-1.5 text-[#a1a1aa] hover:text-white transition-colors"
                aria-label="Copy code"
              >
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                )}
              </button>
            </div>
            <div className="p-5 overflow-x-auto bg-[#0a0a0a]">
              <code
                className="text-sm md:text-[15px] text-[#e5e5e5] whitespace-nowrap"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {commandText}
              </code>
            </div>
          </div>
        </div>

        <div
          ref={videoContainerRef}
          className="relative w-full max-w-[1600px] mx-auto rounded-[24px] overflow-hidden border border-white/5 shadow-2xl bg-black/50 cursor-none transform-gpu"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}
          onMouseEnter={() => setIsHoveringVideo(true)}
          onMouseLeave={() => setIsHoveringVideo(false)}
        >
          <video
            src="/githate.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto pointer-events-none block"
            style={{ borderRadius: '24px' }}
          />

          {/* Custom Cursor Overlay */}
          {isHoveringVideo && (
            <div
              className="absolute pointer-events-none z-50 transition-all duration-75 ease-out"
              style={{
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                left: "-8px", // Center adjustment
                top: "-8px",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2L10.4 22L13.8 13.8L22 10.4L4 2Z" fill="black" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </section>

      {/* Features / Commands Section */}
      <section className="w-full max-w-[1100px] px-6 py-20 z-10">
        <h2
          className="text-4xl md:text-[56px] text-center text-white min-w-max tracking-tight mb-20"
          style={{ fontFamily: "var(--font-instrument)" }}
        >
          Everything you need right in your terminal.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mt-16">
          {/* Command 1: Scan */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 bg-[#161618] border border-white/10 flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><line x1="16" y1="5" x2="22" y2="5" /><line x1="19" y1="2" x2="19" y2="8" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-2">Scan</h3>
            <p className="text-[#8e8e93] text-[15px] leading-relaxed">
              Scans your GitHub profile to instantly identify who you follow that doesn't follow you back.
            </p>
          </div>

          {/* Command 2: Haters */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 bg-[#161618] border border-white/10 flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="23" y2="12" /><line x1="23" y1="8" x2="19" y2="12" /></svg>
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-2">Haters</h3>
            <p className="text-[#8e8e93] text-[15px] leading-relaxed">
              Lists the users who recently unfollowed you so you can track your absolute biggest haters.
            </p>
          </div>

          {/* Command 3: Following */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 bg-[#161618] border border-white/10 flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-2">Following</h3>
            <p className="text-[#8e8e93] text-[15px] leading-relaxed">
              See who you are following with a neat, stylized terminal output tailored to your needs.
            </p>
          </div>

          {/* Command 4: Watch */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 bg-[#161618] border border-white/10 flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-2">Watch</h3>
            <p className="text-[#8e8e93] text-[15px] leading-relaxed">
              Automated tracking runs in the background. Get notified the moment your follower count drops.
            </p>
          </div>

          {/* Command 5: Repl */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 bg-[#161618] border border-white/10 flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-2">REPL</h3>
            <p className="text-[#8e8e93] text-[15px] leading-relaxed">
              Launch an interactive CLI shell to manage your GitHub social graph with blazing speed.
            </p>
          </div>

          {/* Command 6: Daemon Control */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 bg-[#161618] border border-white/10 flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-2">Daemon</h3>
            <p className="text-[#8e8e93] text-[15px] leading-relaxed">
              Control the background watcher easily—start, stop, or check the status of your live stalker.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-10 py-24 border-t border-[rgba(255,255,255,0.05)] z-10 px-12 relative">
        <div className="flex flex-col max-w-[1000px] mx-auto w-full">
          <p
            className="text-5xl md:text-[64px] mb-[102px] z-10 text-center text-white tracking-tight"
            style={{ fontFamily: "var(--font-instrument)" }}
          >
            Let's track our haters together
          </p>
          <div className="flex flex-row justify-center items-start gap-12 text-[14px] text-[#8e8e93]">
            <div className="mt-1" style={{ fontFamily: "var(--font-geist-mono)" }}>
              <span>@Githate 2026</span>
            </div>
            <div className="flex flex-col gap-2 text-right z-10" style={{ fontFamily: "var(--font-geist-mono)" }}>
              <SocialLink
                href="https://github.com/GithubAnant"
                label="GithubAnant"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="group-hover:text-white text-[#8e8e93] transition-colors">
                    <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.81 8.205 23.385C8.805 23.13 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C5.67 21.3 4.965 18.96 4.965 18.96C4.425 17.58 3.63 17.22 3.63 17.22C2.535 16.47 3.72 16.485 3.72 16.485C4.935 16.575 5.565 17.73 5.565 17.73C6.645 19.575 8.355 19.035 9.075 18.72C9.18 17.91 9.51 17.37 9.87 17.055C7.2 16.755 4.395 15.72 4.395 11.085C4.395 9.765 4.86 8.685 5.625 7.845C5.505 7.545 5.085 6.315 5.745 4.665C5.745 4.665 6.75 4.35 9.03 5.895C9.99 5.625 11.01 5.505 12.03 5.505C13.05 5.505 14.07 5.625 15.03 5.895C17.31 4.35 18.315 4.665 18.315 4.665C18.975 6.315 18.555 7.545 18.435 7.845C19.2 8.685 19.665 9.765 19.665 11.085C19.665 15.735 16.86 16.755 14.175 17.055C14.625 17.445 15.03 18.21 15.03 19.395C15.03 21.09 15.015 22.455 15.015 22.815C15.015 23.145 15.24 23.505 15.84 23.385C20.58 21.81 24 17.31 24 12C24 5.37 18.63 0 12 0Z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://twitter.com/anant_hq"
                label="anant_hq"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" className="group-hover:text-white text-[#8e8e93] transition-colors">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://linkedin.com/in/anantsinghal1"
                label="anantsinghal1"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="group-hover:text-white text-[#8e8e93] transition-colors">
                    <path d="M20.447 20.452H16.92V14.88C16.92 13.551 16.895 11.842 15.068 11.842C13.216 11.842 12.932 13.287 12.932 14.786V20.452H9.408V9H12.787V10.564H12.834C13.303 9.673 14.453 8.745 16.149 8.745C19.695 8.745 20.447 11.08 20.447 14.175V20.452ZM5.337 7.433C4.205 7.433 3.29 6.517 3.29 5.385C3.29 4.253 4.205 3.336 5.337 3.336C6.468 3.336 7.394 4.253 7.394 5.385C7.394 6.517 6.468 7.433 5.337 7.433ZM7.1 20.452H3.578V9H7.1V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.226 0.792 24 1.771 24H22.222C23.2 24 24 23.226 24 22.271V1.729C24 0.774 23.2 0 22.225 0Z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
