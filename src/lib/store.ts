import { create } from "zustand";

interface Question {
  question: string;
  options: string[];
  answer: string;
  instrument: string;
}

interface State {
  name: string;
  selectedInstruments: string[];
  questions: Question[];
  answers: Record<string, string>;
  setFullName: (name: string) => void;
  setSelectedInstruments: (instruments: string[]) => void;
  setQuestions: (questions: Question[]) => void;
  setAnswers: (answers: Record<string, string>) => void;
  reset: () => void;
}

export const useStore = create<State>((set) => ({
  name: "",
  selectedInstruments: [],
  questions: [],
  answers: {},
  setFullName: (name) => set({ name }),
  setSelectedInstruments: (instruments) =>
    set({ selectedInstruments: instruments }),
  setQuestions: (questions) => set({ questions }),
  setAnswers: (answers) => set({ answers }),
  reset: () =>
    set({ name: "", selectedInstruments: [], questions: [], answers: {} }),
}));
