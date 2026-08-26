import { Career, CareerDomain, DemandLevel } from '../types';
import { mockCareers } from '../data/mockCareers';

export interface CareerFilterCriteria {
  searchQuery?: string;
  domain?: CareerDomain | 'All';
  demand?: DemandLevel | 'All';
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string | 'All';
  requiredSkills?: string[];
  sortBy?: 'match' | 'salary-high' | 'salary-low' | 'demand' | 'growth' | 'title';
}

export const careerService = {
  getAllCareers(): Career[] {
    const stored = localStorage.getItem('pathseeker_careers');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback to mock
      }
    }
    return mockCareers;
  },

  getCareerById(id: string): Career | undefined {
    const careers = this.getAllCareers();
    return careers.find((c) => c.id === id || c.slug === id);
  },

  saveCareers(careers: Career[]) {
    localStorage.setItem('pathseeker_careers', JSON.stringify(careers));
  },

  filterCareers(criteria: CareerFilterCriteria): Career[] {
    let list = this.getAllCareers();

    // Domain filter
    if (criteria.domain && criteria.domain !== 'All') {
      list = list.filter((c) => c.domain === criteria.domain);
    }

    // Demand filter
    if (criteria.demand && criteria.demand !== 'All') {
      list = list.filter((c) => c.demandLevel === criteria.demand);
    }

    // Salary filter
    if (criteria.salaryMin !== undefined) {
      list = list.filter((c) => c.averageSalary >= (criteria.salaryMin || 0));
    }
    if (criteria.salaryMax !== undefined) {
      list = list.filter((c) => c.averageSalary <= (criteria.salaryMax || 1000000));
    }

    // Skills filter
    if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
      list = list.filter((c) =>
        criteria.requiredSkills!.some((skill) =>
          c.requiredSkills.some((req) => req.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // Text search
    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const q = criteria.searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q) ||
          c.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
          c.tools.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (criteria.sortBy === 'salary-high') {
      list.sort((a, b) => b.averageSalary - a.averageSalary);
    } else if (criteria.sortBy === 'salary-low') {
      list.sort((a, b) => a.averageSalary - b.averageSalary);
    } else if (criteria.sortBy === 'demand') {
      const demandOrder: Record<DemandLevel, number> = { 'Very High': 4, High: 3, Moderate: 2, Steady: 1 };
      list.sort((a, b) => (demandOrder[b.demandLevel] || 0) - (demandOrder[a.demandLevel] || 0));
    } else if (criteria.sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: matchScore
      list.sort((a, b) => b.matchScore - a.matchScore);
    }

    return list;
  }
};
