"use client";

import * as React from "react";
import Link from "next/link";
import { Send, Trash2, Bot, User, Sparkles, ExternalLink } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getAssistantReply } from "@/lib/assistant";
import { COURSES } from "@/data/courses";
import { ROLES, getRoleById } from "@/data/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, Course } from "@/types";

export function ChatPanel({ isFloating = false }: { isFloating?: boolean }) {
  const {
    chatHistory,
    addChatMessage,
    clearChat,
    assessment,
    knownSkills,
    track,
  } = useAppStore();

  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const activeRole = assessment?.careerGoal
    ? getRoleById(assessment.careerGoal) || ROLES.find((r) => r.track === track) || ROLES[0]
    : ROLES.find((r) => r.track === track) || ROLES[0];

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isTyping) return;

    setInput("");

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setIsTyping(true);

    try {
      const response = await getAssistantReply(textToSend, {
        assessment,
        knownSkills,
        role: activeRole,
        allCourses: COURSES,
      });

      // Simulate a fast natural typing delay (250-400ms)
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: "assistant",
          text: response.text,
          timestamp: new Date().toISOString(),
          suggestedCourses: response.suggestedCourses,
          quickReplies: response.quickReplies,
        };
        addChatMessage(assistantMsg);
        setIsTyping(false);
      }, 350);
    } catch {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-background border border-border rounded-card overflow-hidden ${isFloating ? "shadow-xl" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-accent-soft text-accent flex items-center justify-center border border-accent/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-foreground">CourseAI Assistant</span>
              <Badge variant="accent" className="text-[10px] py-0 px-1.5 font-normal">
                Deterministic Engine
              </Badge>
            </div>
            <p className="text-[10px] text-muted">Transparent rule-based learning mentor (No live LLM)</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="h-7 px-2 text-xs text-muted hover:text-danger gap-1"
          title="Clear chat history"
        >
          <Trash2 className="h-3 w-3" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-start gap-2 max-w-[85%]">
              {msg.sender === "assistant" && (
                <div className="h-6 w-6 rounded-full bg-accent-soft text-accent flex-shrink-0 flex items-center justify-center border border-accent/20 mt-0.5">
                  <Bot className="h-3 w-3" />
                </div>
              )}

              <div
                className={`p-3 rounded-card leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-accent text-white rounded-tr-none"
                    : "bg-surface border border-border text-foreground rounded-tl-none whitespace-pre-line"
                }`}
              >
                {msg.text}

                {/* Suggested Courses Cards */}
                {msg.suggestedCourses && msg.suggestedCourses.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
                    <p className="font-semibold text-[11px] text-muted">Recommended Courses:</p>
                    {msg.suggestedCourses.map((c: Course) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-lg border border-border bg-background flex items-center justify-between gap-2 hover:border-accent transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-xs text-foreground truncate">{c.title}</p>
                          <p className="text-[10px] text-muted">
                            {c.provider} · {c.durationHours} hrs · {c.priceUSD === 0 ? "Free" : `$${c.priceUSD}`}
                          </p>
                        </div>
                        <Link href={`/courses/${c.id}`}>
                          <Button size="sm" variant="secondary" className="h-6 px-2 text-[10px] gap-1 flex-shrink-0">
                            <span>View</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="h-6 w-6 rounded-full bg-surface border border-border text-muted flex-shrink-0 flex items-center justify-center mt-0.5">
                  <User className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Quick replies below latest assistant message */}
            {msg.sender === "assistant" && msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                {msg.quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => handleSend(qr)}
                    className="text-[11px] bg-background hover:bg-accent-soft hover:text-accent border border-border rounded-full px-2.5 py-1 text-muted transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-accent" />
                    {qr}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-muted">
            <div className="h-6 w-6 rounded-full bg-accent-soft text-accent flex items-center justify-center border border-accent/20">
              <Bot className="h-3 w-3" />
            </div>
            <div className="bg-surface border border-border px-3 py-2 rounded-card text-muted flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-border bg-surface">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about skills, study plans, or course comparisons..."
            className="text-xs bg-background h-9 shadow-none"
            disabled={isTyping}
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="h-9 w-9 p-0 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
