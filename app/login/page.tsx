"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, User } from "lucide-react";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const r = useRouter();

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("courseai-user", JSON.stringify({ name, email }));
    }
    r.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm mx-auto shadow-sm">
          CA
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome to CourseAI
        </h1>
        <p className="text-xs text-muted">
          Local profile session. No passwords or remote databases required.
        </p>
      </div>

      <form onSubmit={go} className="p-6 rounded-card border border-border bg-background space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground block">Your Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            className="text-xs h-9 bg-surface"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground block">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            className="text-xs h-9 bg-surface"
            required
          />
        </div>

        <div className="p-3 rounded-md bg-surface border border-border text-[11px] text-muted flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          <span>Session is saved locally in your browser. Add NextAuth/Auth.js for remote enterprise sync.</span>
        </div>

        <Button type="submit" className="w-full text-xs h-9">
          Continue to Dashboard
        </Button>
      </form>
    </div>
  );
}
