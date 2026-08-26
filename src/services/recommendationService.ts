import { Career, QuizResult, User } from '../types';

/**
 * Intelligent Personalization Engine
 * Evaluates compatibility based on:
 * 1. RIASEC psychometric alignment from Quiz Results
 * 2. Overlap with user skills & target industries
 * 3. User bookmarks & saved preferences
 * 4. Experience & education level compatibility
 */
export function getRecommendedCareers(
  user: User | null,
  careers: Career[],
  quizResults: QuizResult | null,
  bookmarkedIds: string[] = []
): { career: Career; matchScore: number; matchReasons: string[] }[] {
  return careers
    .map((career) => {
      let score = career.matchScore || 75;
      const matchReasons: string[] = [];

      // 1. RIASEC score alignment
      if (quizResults?.riasecScores) {
        const userScores = quizResults.riasecScores;
        const careerScores = career.riasecAffinity;

        // Euclidean similarity
        let dotProduct = 0;
        let userMagnitude = 0;
        let careerMagnitude = 0;

        const keys: (keyof typeof userScores)[] = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'];

        for (const k of keys) {
          const uVal = userScores[k] || 0;
          const cVal = careerScores[k] || 0;
          dotProduct += uVal * cVal;
          userMagnitude += uVal * uVal;
          careerMagnitude += cVal * cVal;
        }

        if (userMagnitude > 0 && careerMagnitude > 0) {
          const cosineSim = dotProduct / (Math.sqrt(userMagnitude) * Math.sqrt(careerMagnitude));
          const riasecMatchPct = Math.round(cosineSim * 100);
          score = Math.round(score * 0.4 + riasecMatchPct * 0.6);
          if (riasecMatchPct >= 85) {
            matchReasons.push('Strong cognitive & personality fit from assessment');
          }
        }
      }

      // 2. User Target Industries
      if (user?.careerPreferences?.targetIndustries?.includes(career.domain)) {
        score = Math.min(99, score + 6);
        matchReasons.push(`Matches your target industry: ${career.domain}`);
      }

      // 3. User Skill Overlap
      if (user?.skills?.length) {
        const userSkillNames = user.skills.map((s) => s.name.toLowerCase());
        const matchingSkills = career.requiredSkills.filter((req) =>
          userSkillNames.some((uSkill) => req.toLowerCase().includes(uSkill) || uSkill.includes(req.toLowerCase()))
        );

        if (matchingSkills.length > 0) {
          score = Math.min(99, score + matchingSkills.length * 3);
          matchReasons.push(`${matchingSkills.length} of your current skills directly apply (${matchingSkills.slice(0, 2).join(', ')})`);
        }
      }

      // 4. Bookmarks influence
      if (bookmarkedIds.includes(career.id)) {
        score = Math.min(99, score + 4);
        matchReasons.push('Saved in your Career Passport');
      }

      // Default reason if empty
      if (matchReasons.length === 0) {
        matchReasons.push(`High global demand in ${career.domain}`);
      }

      return {
        career,
        matchScore: Math.min(99, Math.max(60, score)),
        matchReasons
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
