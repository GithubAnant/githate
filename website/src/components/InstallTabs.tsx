"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type PackageManager = "npx" | "npm" | "bun" | "brew" | "curl";

const commands = {
    npm: "npm install -g githate",
    npx: "npx githate",
    bun: "bunx githate",
    brew: "brew install githate",
    curl: "curl -fsSL https://githate.anants.studio/install.sh | bash",
};

export function InstallTabs() {
    const [activeTab, setActiveTab] = useState<PackageManager>("npm");
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(commands[activeTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs: { id: PackageManager; label: string }[] = [
        { id: "npx", label: "npx" },
        { id: "npm", label: "npm" },
        { id: "bun", label: "bun" },
        { id: "brew", label: "brew" },
        { id: "curl", label: "curl" },
    ];

    return (
        <div className="w-full mt-6 mb-8 relative">
            <div className="bg-[#0a0a0a] rounded-md overflow-hidden flex flex-col shadow-none">
                {/* Tabs Header */}
                <div className="flex items-center px-6 pt-0 bg-[#0a0a0a]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-4 text-[13px] font-mono transition-colors relative",
                                activeTab === tab.id
                                    ? "text-white"
                                    : "text-[#555555] hover:text-[#888]"
                            )}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute -bottom-px left-4 right-4 h-px bg-white" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Command Area */}
                <div className="px-10 py-6 flex items-center justify-between font-mono text-[13px]">
                    <div className="flex items-center text-[#555555]">
                        <span className="text-white bg-transparent outline-none select-all">{commands[activeTab]}</span>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="text-[#555555] hover:text-white transition-colors ml-4"
                        title="Copy command"
                    >
                        {copied ? (
                            <span className="text-xs uppercase text-white">Copied</span>
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
