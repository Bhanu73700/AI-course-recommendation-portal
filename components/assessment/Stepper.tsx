import * as React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onStepClick?: (step: number) => void;
}

export function Stepper({ currentStep, totalSteps, steps, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      {/* Mobile step text */}
      <div className="flex sm:hidden items-center justify-between text-xs text-muted mb-2">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span className="font-semibold text-foreground">{steps[currentStep]}</span>
      </div>

      {/* Progress bar line for mobile */}
      <div className="h-1 w-full bg-border rounded-full overflow-hidden sm:hidden mb-4">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-3.5 left-0 right-0 h-[1px] bg-border -z-0" />

        {steps.map((label, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <button
              key={label}
              type="button"
              disabled={!onStepClick || index > currentStep}
              onClick={() => onStepClick && index <= currentStep && onStepClick(index)}
              className="flex flex-col items-center group relative z-10 focus:outline-none disabled:cursor-default"
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-colors ${
                  isDone
                    ? "bg-accent text-white"
                    : isCurrent
                    ? "border-2 border-accent bg-background text-accent"
                    : "border border-border bg-background text-muted"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={`text-[11px] mt-1.5 transition-colors text-center max-w-[80px] truncate ${
                  isCurrent
                    ? "font-semibold text-foreground"
                    : isDone
                    ? "text-foreground/80"
                    : "text-muted"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
