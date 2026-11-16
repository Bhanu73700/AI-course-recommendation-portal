"use client";

import * as React from "react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { Bot, Sparkles, Shield, Cpu, HelpCircle } from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tightest text-foreground">
              AI Learning Assistant
            </h1>
            <span className="text-[10px] font-mono uppercase bg-accent-soft text-accent border border-accent/20 px-2 py-0.5 rounded-full font-medium">
              Demo Engine
            </span>
          </div>
          <p className="text-xs text-muted">
            Ask for study advice, skill explanations, framework comparisons, or roadmap clarifications.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-muted font-mono bg-surface border border-border px-3 py-1 rounded-full">
          <Shield className="h-3.5 w-3.5 text-accent" />
          <span>Transparent Rule-Based Intent Engine</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 min-h-0">
        <ChatPanel />
      </div>
    </div>
  );
}
