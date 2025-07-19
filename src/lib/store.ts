import { create } from "zustand";

interface Question {
  question: string;
  options: string[];
  answer: string;
  instrument: string;
  difficulty: string;
}

interface State {
  name: string;
  selectedInstruments: string[];
  difficulty: string;
  questions: Question[];
  answers: Record<string, string>;
  setFullName: (name: string) => void;
  setSelectedInstruments: (instruments: string[]) => void;
  setDifficulty: (difficulty: string) => void;
  setQuestions: (questions: Question[]) => void;
  setAnswers: (answers: Record<string, string>) => void;
  reset: () => void;
}

export const useStore = create<State>((set) => ({
  name: "",
  selectedInstruments: [],
  difficulty: "Easy",
  questions: [],
  answers: {},
  setFullName: (name) => set({ name }),
  setSelectedInstruments: (instruments) =>
    set({ selectedInstruments: instruments }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setQuestions: (questions) => set({ questions }),
  setAnswers: (answers) => set({ answers }),
  reset: () =>
    set({
      name: "",
      selectedInstruments: [],
      questions: [],
      answers: {},
      difficulty: "Easy",
    }),
}));
