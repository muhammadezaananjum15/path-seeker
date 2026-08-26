import { create } from 'zustand';
import { Feedback } from '../types';
import { feedbackService } from '../services/feedbackService';

interface FeedbackState {
  feedbacks: Feedback[];

  // Actions
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'submittedAt' | 'status'>) => Feedback;
  respondToFeedback: (id: string, reply: string) => void;
  replyToFeedback: (id: string, reply: string, status: 'In Review' | 'Resolved') => void;
  deleteFeedback: (id: string) => void;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  feedbacks: feedbackService.getAllFeedback(),

  submitFeedback: (feedback) => {
    const newFb = feedbackService.submitFeedback(feedback);
    set({ feedbacks: feedbackService.getAllFeedback() });
    return newFb;
  },

  respondToFeedback: (id, reply) => {
    const updated = get().feedbacks.map((f) =>
      f.id === id
        ? { ...f, adminReply: reply, status: 'Resolved' as const }
        : f
    );
    feedbackService.saveFeedbacks(updated);
    set({ feedbacks: updated });
  },

  replyToFeedback: (id, reply, status) => {
    const updated = feedbackService.replyToFeedback(id, reply, status);
    set({ feedbacks: [...updated] });
  },

  deleteFeedback: (id: string) => {
    const all = get().feedbacks.filter((f) => f.id !== id);
    feedbackService.saveFeedbacks(all);
    set({ feedbacks: all });
  }
}));
