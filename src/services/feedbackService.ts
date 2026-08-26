import { Feedback } from '../types';

const defaultFeedbacks: Feedback[] = [
  {
    id: 'fb-01',
    userId: 'usr-student-01',
    userName: 'Ezaan Vance',
    userEmail: 'ezaan.vance@pathseeker.io',
    category: 'Feature Request',
    rating: 5,
    subject: 'Interactive Career Path Comparison Chart',
    message: 'The ability to compare three careers side-by-side with radar charts is amazing. Would love to also see remote vs on-site breakdown filters!',
    submittedAt: '2026-02-21T14:20:00Z',
    status: 'In Review',
    adminReply: 'Thank you Ezaan! Remote workplace filtering is currently being indexed in our v2 data catalog.'
  },
  {
    id: 'fb-02',
    userId: 'usr-grad-02',
    userName: 'Ayla Chen',
    userEmail: 'ayla.chen@pathseeker.io',
    category: 'Content Suggestion',
    rating: 5,
    subject: 'More Product Management Case Study Breakdowns',
    message: 'The AI masterclasses are top notch. Please add more real-world PM PRD examples for health tech.',
    submittedAt: '2026-02-18T09:12:00Z',
    status: 'Resolved',
    adminReply: 'Added 2 new PM Playbooks in the Business Resources section!'
  }
];

export const feedbackService = {
  getAllFeedback(): Feedback[] {
    const stored = localStorage.getItem('pathseeker_feedbacks');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return defaultFeedbacks;
  },

  saveFeedbacks(items: Feedback[]) {
    localStorage.setItem('pathseeker_feedbacks', JSON.stringify(items));
  },

  submitFeedback(feedback: Omit<Feedback, 'id' | 'submittedAt' | 'status'>): Feedback {
    const all = this.getAllFeedback();
    const newFb: Feedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'New'
    };
    all.unshift(newFb);
    this.saveFeedbacks(all);
    return newFb;
  },

  replyToFeedback(id: string, reply: string, status: 'In Review' | 'Resolved'): Feedback[] {
    const all = this.getAllFeedback();
    const target = all.find((f) => f.id === id);
    if (target) {
      target.adminReply = reply;
      target.status = status;
      this.saveFeedbacks(all);
    }
    return all;
  }
};
