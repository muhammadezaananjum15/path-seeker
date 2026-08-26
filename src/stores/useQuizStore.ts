import { create } from 'zustand';
import { QuizQuestion, QuizResult } from '../types';
import { quizService } from '../services/quizService';

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  isCompleted: boolean;
  timeRemaining: number;
  activeResult: QuizResult | null;
  quizHistory: QuizResult[];

  // Actions
  setAnswer: (questionId: string, answer: any) => void;
  nextQuestion: () => boolean;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => QuizResult;
  resetQuiz: () => void;
  retakeQuiz: () => void;
  setTimeRemaining: (time: number) => void;
  // Admin actions
  addQuestion: (question: QuizQuestion) => void;
  updateQuestion: (questionId: string, updates: Partial<QuizQuestion>) => void;
  deleteQuestion: (questionId: string) => void;
}

const QUESTIONS_KEY = 'pathseeker-quiz-questions';

const loadQuestions = (): QuizQuestion[] => {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return quizService.getQuestions();
};

const saveQuestions = (questions: QuizQuestion[]) => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const useQuizStore = create<QuizState>((set, get) => {
  const initialQuestions = loadQuestions();
  const latestResult = quizService.getLatestResult();
  const history = quizService.getQuizHistory();

  return {
    questions: initialQuestions,
    currentQuestionIndex: 0,
    answers: {},
    isCompleted: !!latestResult,
    timeRemaining: 600,
    activeResult: latestResult,
    quizHistory: history,

    setAnswer: (questionId: string, answer: any) => {
      set((state) => ({
        answers: { ...state.answers, [questionId]: answer }
      }));
    },

    nextQuestion: () => {
      const { currentQuestionIndex, questions } = get();
      if (currentQuestionIndex < questions.length - 1) {
        set({ currentQuestionIndex: currentQuestionIndex + 1 });
        return false;
      }
      return true;
    },

    prevQuestion: () => {
      const { currentQuestionIndex } = get();
      if (currentQuestionIndex > 0) {
        set({ currentQuestionIndex: currentQuestionIndex - 1 });
      }
    },

    goToQuestion: (index: number) => {
      const { questions } = get();
      if (index >= 0 && index < questions.length) {
        set({ currentQuestionIndex: index });
      }
    },

    submitQuiz: () => {
      const { answers } = get();
      const result = quizService.calculateResults(answers);
      set({
        activeResult: result,
        isCompleted: true,
        quizHistory: quizService.getQuizHistory()
      });
      return result;
    },

    resetQuiz: () => {
      set({
        currentQuestionIndex: 0,
        answers: {},
        isCompleted: false,
        timeRemaining: 600
      });
    },

    retakeQuiz: () => {
      set({
        currentQuestionIndex: 0,
        answers: {},
        isCompleted: false,
        timeRemaining: 600,
        activeResult: null
      });
    },

    setTimeRemaining: (time: number) => {
      set({ timeRemaining: time });
    },

    addQuestion: (question: QuizQuestion) => {
      const updated = [...get().questions, question];
      saveQuestions(updated);
      set({ questions: updated });
    },

    updateQuestion: (questionId: string, updates: Partial<QuizQuestion>) => {
      const updated = get().questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      );
      saveQuestions(updated);
      set({ questions: updated });
    },

    deleteQuestion: (questionId: string) => {
      const updated = get().questions.filter((q) => q.id !== questionId);
      saveQuestions(updated);
      set({ questions: updated });
    }
  };
});
