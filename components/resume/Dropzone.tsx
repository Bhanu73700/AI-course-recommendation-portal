"use client";

import * as React from "react";
import { UploadCloud, FileText, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DropzoneProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const SAMPLE_RESUME = `Alex Rivera
Email: alex.rivera@example.com | GitHub: github.com/alexrivera-dev | Portfolio: alexrivera.dev

OBJECTIVE
Motivated software developer looking to contribute to modern full-stack and mobile applications.

TECHNICAL SKILLS
Languages & Frameworks: JavaScript, TypeScript, React, Next.js, HTML5, CSS3, Tailwind CSS, Node.js, Express, SQL, Git.
Tools: Android Studio, Jest, Figma, Docker basics, Postman.

PROJECTS
E-Commerce Web Application (Next.js & TypeScript)
- Architected responsive online storefront utilizing Next.js App Router and Tailwind CSS, increasing mobile user engagement by 42%.
- Integrated REST API endpoints with Node.js and PostgreSQL database for real-time inventory management.
- Implemented client-side state management and automated unit tests with Jest, achieving 85% test coverage.

Android Task & Fitness Tracker (Kotlin & Compose)
- Engineered native Android application with Kotlin and Jetpack Compose utilizing MVVM architecture.
- Implemented local data caching with Room database and Coroutines, reducing offline data retrieval latency by 50%.
- Deployed signed APK to Google Play internal testing track.

EDUCATION
B.S. in Computer Science | State University (Graduated May 2024)`;

export function Dropzone({ onAnalyze, isAnalyzing }: DropzoneProps) {
  const [tab, setTab] = React.useState<"paste" | "upload">("paste");
  const [pastedText, setPastedText] = React.useState("");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    onAnalyze(pastedText);
  };

  const handleLoadSample = () => {
    setPastedText(SAMPLE_RESUME);
    onAnalyze(SAMPLE_RESUME);
  };

  const parseFile = async (file: File) => {
    setErrorMsg(null);
    setFileName(file.name);

    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      if (ext === "txt") {
        const text = await file.text();
        onAnalyze(text);
      } else if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (result.value) {
          onAnalyze(result.value);
        } else {
          throw new Error("Could not extract text from DOCX.");
        }
      } else if (ext === "pdf") {
        const arrayBuffer = await file.arrayBuffer();
        // Dynamic import of pdfjs
        const pdfjs = await import("pdfjs-dist");
        // Use unpkg worker
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
          fullText += pageText + "\n";
        }

        if (fullText.trim()) {
          onAnalyze(fullText);
        } else {
          throw new Error("PDF text stream was empty or scanned image.");
        }
      } else {
        throw new Error("Unsupported format. Please upload .txt, .pdf, or .docx");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "File parsing failed";
      setErrorMsg(`${msg}. Falling back to paste mode.`);
      setTab("paste");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      parseFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as "paste" | "upload")} className="w-full">
        <div className="flex items-center justify-between pb-2">
          <TabsList>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="upload">Upload File (.pdf, .docx, .txt)</TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadSample}
            className="text-xs text-accent hover:text-accent-hover gap-1 h-7"
          >
            <Sparkles className="h-3 w-3" />
            <span>Load Sample Resume</span>
          </Button>
        </div>

        <TabsContent value="paste" className="space-y-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your resume plain text or Markdown here..."
            className="w-full h-56 p-4 rounded-card border border-border bg-background text-foreground text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent resize-y"
          />

          <div className="flex justify-end">
            <Button
              onClick={handlePasteSubmit}
              disabled={!pastedText.trim() || isAnalyzing}
              className="text-xs h-9 px-6"
            >
              {isAnalyzing ? "Analyzing Resume..." : "Analyze Resume"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-card p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-background ${
              isDragOver
                ? "border-accent bg-accent-soft/30"
                : "border-border hover:border-foreground/40"
            }`}
            onClick={() => document.getElementById("resume-file-input")?.click()}
          >
            <input
              id="resume-file-input"
              type="file"
              accept=".txt,.pdf,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  parseFile(e.target.files[0]);
                }
              }}
            />

            <UploadCloud className="h-9 w-9 text-muted mb-2 group-hover:text-accent" />
            <p className="text-sm font-semibold text-foreground">
              {fileName ? fileName : "Drag & drop your resume file here"}
            </p>
            <p className="text-xs text-muted mt-1">
              Supports .pdf, .docx, and .txt files (Processed 100% locally in your browser)
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-warning bg-warning/5 border border-warning/20 p-2.5 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
