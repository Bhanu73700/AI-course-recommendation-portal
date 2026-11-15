"use client";

import * as React from "react";
import { Printer, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FINAL_ITEMS = [
  {
    id: "check-portfolio",
    title: "Live Portfolio / Demo Deployment",
    desc: "Host 2-3 substantial projects live with responsive design and accessibility.",
  },
  {
    id: "check-github",
    title: "Polished GitHub Repository",
    desc: "Write detailed READMEs with screenshots, architecture diagrams, and clean Git commits.",
  },
  {
    id: "check-resume",
    title: "Targeted 1-Page Resume",
    desc: "Feature quantified bullets and relevant technical stack checked via CourseAI Resume Analyzer.",
  },
  {
    id: "check-interview",
    title: "Mock Interview & Technical Defense",
    desc: "Practice architectural whiteboarding and answering questions on state, networking, and asynchronous routines.",
  },
];

export function Checklist() {
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="rounded-card border border-border bg-surface p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground">
            Job-Ready Launch Checklist
          </h3>
          <p className="text-xs text-muted">Final steps to secure technical interviews</p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrint}
          className="text-xs gap-1.5 h-8 no-print self-start sm:self-center"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Save as PDF</span>
        </Button>
      </div>

      <div className="space-y-2">
        {FINAL_ITEMS.map((item) => {
          const isDone = checkedItems.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="flex items-start gap-3 p-2.5 rounded-md border border-border bg-background cursor-pointer hover:border-foreground/30 transition-colors select-none"
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 text-muted flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-xs font-semibold ${isDone ? "line-through text-muted" : "text-foreground"}`}>
                  {item.title}
                </p>
                <p className="text-[11px] text-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
