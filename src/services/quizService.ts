import { QuizQuestion, QuizResult, CareerDomain } from '../types';
import { mockQuizQuestions } from '../data/mockQuizQuestions';
import { mockCareers } from '../data/mockCareers';

export const quizService = {
  getQuestions(): QuizQuestion[] {
    const stored = localStorage.getItem('pathseeker_quiz_questions');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return mockQuizQuestions;
  },

  calculateResults(answers: Record<string, any>): QuizResult {
    const questions = this.getQuestions();

    const riasec = {
      realistic: 20,
      investigative: 20,
      artistic: 20,
      social: 20,
      enterprising: 20,
      conventional: 20
    };

    for (const q of questions) {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) continue;

      if (q.type === 'likert') {
        // ans is 1 to 5
        const val = Number(ans) || 3;
        const dim = q.riasecDimension || 'investigative';
        riasec[dim] += val * 12;
      } else if (q.type === 'slider') {
        // ans is 0 to 100
        const val = Number(ans) || 50;
        const dim = q.riasecDimension || 'enterprising';
        riasec[dim] += Math.round((val / 100) * 45);
      } else if (q.type === 'choice' || q.type === 'visual') {
        // ans is optionId
        const option = q.options?.find((o) => o.id === ans);
        if (option?.riasecWeights) {
          for (const [key, weight] of Object.entries(option.riasecWeights)) {
            if (key in riasec && typeof weight === 'number') {
              (riasec as any)[key] += weight * 10;
            }
          }
        }
      }
    }

    // Normalize to percentages (0 to 100)
    const maxVal = Math.max(...Object.values(riasec), 1);
    const normalizedRiasec = {
      realistic: Math.min(100, Math.round((riasec.realistic / maxVal) * 95)),
      investigative: Math.min(100, Math.round((riasec.investigative / maxVal) * 98)),
      artistic: Math.min(100, Math.round((riasec.artistic / maxVal) * 94)),
      social: Math.min(100, Math.round((riasec.social / maxVal) * 92)),
      enterprising: Math.min(100, Math.round((riasec.enterprising / maxVal) * 96)),
      conventional: Math.min(100, Math.round((riasec.conventional / maxVal) * 90))
    };

    // Calculate top domains
    const topDomains: CareerDomain[] = [];
    if (normalizedRiasec.investigative > 70 || normalizedRiasec.realistic > 70) {
      topDomains.push('Technology', 'Engineering');
    }
    if (normalizedRiasec.artistic > 65) {
      topDomains.push('Design', 'Arts & Humanities');
    }
    if (normalizedRiasec.enterprising > 65) {
      topDomains.push('Business', 'Finance');
    }
    if (normalizedRiasec.social > 65) {
      topDomains.push('Healthcare', 'Public Services');
    }
    if (topDomains.length === 0) {
      topDomains.push('Technology', 'Business', 'Design');
    }

    // Top recommended careers
    const recommendedCareers = mockCareers
      .filter((c) => topDomains.includes(c.domain))
      .slice(0, 4)
      .map((c) => c.id);

    const overallScore = Math.round(
      (normalizedRiasec.investigative + normalizedRiasec.enterprising + normalizedRiasec.artistic) / 3
    );

    const strengthSummary = [
      'High capacity for quantitative problem solving and cognitive abstraction.',
      'Aspirational drive for strategic leadership and high-impact digital systems.',
      'Balanced visual intuition paired with disciplined execution.'
    ];

    const improvementAreas = [
      'Deepen hands-on proficiency with cloud infrastructure & container tooling.',
      'Expand comfort with executive pitch decks and high-stakes negotiation.'
    ];

    const result: QuizResult = {
      id: `quiz-res-${Date.now()}`,
      overallScore: Math.min(98, Math.max(65, overallScore)),
      date: new Date().toISOString(),
      riasecScores: normalizedRiasec,
      topDomains: Array.from(new Set(topDomains)),
      recommendedCareerIds: recommendedCareers,
      strengthSummary,
      improvementAreas
    };

    // Save to local storage history
    const existing = this.getQuizHistory();
    existing.unshift(result);
    localStorage.setItem('pathseeker_quiz_history', JSON.stringify(existing));
    localStorage.setItem('pathseeker_latest_quiz_result', JSON.stringify(result));

    return result;
  },

  getLatestResult(): QuizResult | null {
    const stored = localStorage.getItem('pathseeker_latest_quiz_result');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  },

  getQuizHistory(): QuizResult[] {
    const stored = localStorage.getItem('pathseeker_quiz_history');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  }
};
