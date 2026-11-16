import * as React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-card border border-border bg-background hover:border-foreground/30 transition-colors flex flex-col justify-between text-left",
        className
      )}
    >
      <div className="flex items-center justify-between text-muted mb-2">
        <span className="text-xs font-medium text-muted">{title}</span>
        {icon && <div className="text-muted">{icon}</div>}
      </div>

      <div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted">
            {trend && <span className="text-success font-medium">{trend}</span>}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
