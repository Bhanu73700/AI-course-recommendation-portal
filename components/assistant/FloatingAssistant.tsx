"use client";

import * as React from "react";
import { MessageSquare, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { Button } from "@/components/ui/button";

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 no-print">
      {isOpen ? (
        <div className="flex flex-col w-[360px] sm:w-[420px] h-[520px] max-h-[80vh] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-2.5 right-12 z-50 h-7 w-7 text-muted hover:text-foreground"
            aria-label="Close assistant panel"
          >
            <X className="h-4 w-4" />
          </Button>
          <ChatPanel isFloating={true} />
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg h-11 px-4 gap-2 bg-accent text-white hover:bg-accent-hover transition-transform hover:scale-105 active:scale-95"
          aria-label="Open AI Learning Assistant"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-medium">Ask Assistant</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </Button>
      )}
    </div>
  );
}
