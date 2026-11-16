import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Assessment, ChatMessage, ProgressEntry, ResumeAnalysis, TrackId } from "@/types";

interface AppState {
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  track: TrackId | null;
  extraTracks: TrackId[];
  setTrack: (track: TrackId) => void;
  setExtraTracks: (tracks: TrackId[]) => void;

  assessment: Assessment | null;
  setAssessment: (assessment: Assessment | null) => void;

  knownSkills: string[];
  addKnownSkill: (skill: string) => void;
  removeKnownSkill: (skill: string) => void;
  setKnownSkills: (skills: string[]) => void;

  wishlist: string[];
  toggleWishlist: (courseId: string) => void;
  isInWishlist: (courseId: string) => boolean;

  progress: Record<string, ProgressEntry>;
  updateProgress: (courseId: string, entry: Partial<ProgressEntry>) => void;
  markCourseCompleted: (courseId: string, skillsEarned?: string[]) => void;

  roadmapCheckpoints: string[];
  toggleCheckpoint: (checkpoint: string) => void;

  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  resumeAnalysis: ResumeAnalysis | null;
  setResumeAnalysis: (analysis: ResumeAnalysis | null) => void;

  resetAllData: () => void;
}

const safeLocalStorage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(name);
    } catch (err) {
      console.warn("localStorage getItem error:", err);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(name, value);
      }
    } catch (err) {
      console.warn("localStorage setItem quota or access error:", err);
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(name);
      }
    } catch (err) {
      console.warn("localStorage removeItem error:", err);
    }
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),

      track: "web",
      extraTracks: [],
      setTrack: (track) => set({ track }),
      setExtraTracks: (extraTracks) => set({ extraTracks }),

      assessment: null,
      setAssessment: (assessment) => {
        if (assessment) {
          set({
            assessment,
            track: assessment.track,
            extraTracks: assessment.extraTracks || [],
            knownSkills: Array.from(new Set([...get().knownSkills, ...assessment.knownSkills])),
          });
        } else {
          set({ assessment: null });
        }
      },

      knownSkills: [],
      addKnownSkill: (skill) => {
        const s = skill.toLowerCase();
        const current = get().knownSkills;
        if (!current.includes(s)) {
          set({ knownSkills: [...current, s] });
        }
      },
      removeKnownSkill: (skill) => {
        const s = skill.toLowerCase();
        set({ knownSkills: get().knownSkills.filter((x) => x !== s) });
      },
      setKnownSkills: (skills) => set({ knownSkills: skills.map((s) => s.toLowerCase()) }),

      wishlist: [],
      toggleWishlist: (courseId) => {
        const current = get().wishlist;
        if (current.includes(courseId)) {
          set({ wishlist: current.filter((id) => id !== courseId) });
        } else {
          set({ wishlist: [...current, courseId] });
        }
      },
      isInWishlist: (courseId) => get().wishlist.includes(courseId),

      progress: {},
      updateProgress: (courseId, entry) => {
        const current = get().progress;
        const existing = current[courseId] || {
          courseId,
          status: "in-progress",
          percent: 0,
          hoursLogged: 0,
          startedAt: new Date().toISOString(),
        };

        const updated = { ...existing, ...entry };
        set({ progress: { ...current, [courseId]: updated } });
      },
      markCourseCompleted: (courseId, skillsEarned = []) => {
        const current = get().progress;
        const existing = current[courseId] || {
          courseId,
          status: "completed",
          percent: 100,
          hoursLogged: 0,
          startedAt: new Date().toISOString(),
        };

        const updated: ProgressEntry = {
          ...existing,
          status: "completed",
          percent: 100,
          completedAt: new Date().toISOString(),
        };

        // Also add earned skills to knownSkills
        const newKnown = Array.from(new Set([...get().knownSkills, ...skillsEarned.map((s) => s.toLowerCase())]));

        set({
          progress: { ...current, [courseId]: updated },
          knownSkills: newKnown,
        });
      },

      roadmapCheckpoints: [],
      toggleCheckpoint: (checkpoint) => {
        const current = get().roadmapCheckpoints;
        if (current.includes(checkpoint)) {
          set({ roadmapCheckpoints: current.filter((c) => c !== checkpoint) });
        } else {
          set({ roadmapCheckpoints: [...current, checkpoint] });
        }
      },

      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),

      chatHistory: [
        {
          id: "welcome-1",
          sender: "assistant",
          text: "Hi! I'm your CourseAI learning assistant. I can help analyze your skill gaps, explain concepts, build personalized study plans, and guide your career roadmap. What are you looking to learn?",
          timestamp: new Date().toISOString(),
          quickReplies: [
            "What should I learn next?",
            "Make me a 4-week study plan",
            "Compare Compose vs XML",
          ],
        },
      ],
      addChatMessage: (msg) => set({ chatHistory: [...get().chatHistory, msg] }),
      clearChat: () =>
        set({
          chatHistory: [
            {
              id: "welcome-reset",
              sender: "assistant",
              text: "Chat cleared. What topic or career goal would you like to explore next?",
              timestamp: new Date().toISOString(),
            },
          ],
        }),

      resumeAnalysis: null,
      setResumeAnalysis: (resumeAnalysis) => set({ resumeAnalysis }),

      resetAllData: () => {
        set({
          track: "web",
          extraTracks: [],
          assessment: null,
          knownSkills: [],
          wishlist: [],
          progress: {},
          roadmapCheckpoints: [],
          resumeAnalysis: null,
          chatHistory: [],
        });
      },
    }),
    {
      name: "courseai:v1",
      storage: createJSONStorage(() => safeLocalStorage),
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Migration from future versions if needed
          return persistedState as AppState;
        }
        return persistedState as AppState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
