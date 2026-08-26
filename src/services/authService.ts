import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockUsers';

export const authService = {
  getUsers(): User[] {
    const stored = localStorage.getItem('pathseeker_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return mockUsers;
  },

  saveUsers(users: User[]) {
    localStorage.setItem('pathseeker_users', JSON.stringify(users));
  },

  getCurrentUser(): User {
    const stored = localStorage.getItem('pathseeker_current_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    // Default to student user Ezaan
    return mockUsers[0];
  },

  setCurrentUser(user: User) {
    localStorage.setItem('pathseeker_current_user', JSON.stringify(user));
  },

  switchRole(role: UserRole): User {
    const users = this.getUsers();
    let targetUser = users.find((u) => u.role === role);
    if (!targetUser) {
      targetUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
    }
    this.setCurrentUser(targetUser);
    return targetUser;
  },

  registerUser(name: string, email: string, role: UserRole): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      passportId: `PS-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: `Aspiring ${role} discovering future career milestones on PathSeeker.`,
      location: 'Global / Remote',
      education: [
        {
          institution: 'Global University',
          degree: 'Bachelor of Science / Arts',
          field: 'General Studies & Technology',
          year: '2024 - 2028'
        }
      ],
      skills: [
        { name: 'Critical Thinking', level: 'Intermediate', category: 'Soft' },
        { name: 'Digital Strategy', level: 'Beginner', category: 'Domain' }
      ],
      interests: ['Artificial Intelligence', 'Product Growth', 'Design Systems'],
      workExperience: [],
      careerPreferences: {
        targetIndustries: ['Technology', 'Design'],
        workStyle: 'Hybrid',
        expectedSalary: 95000,
        preferredRoles: ['Product Designer', 'AI Engineer']
      },
      passportScore: 45,
      unlockedStamps: ['STAMP-FIRST-STEPS'],
      createdAt: new Date().toISOString()
    };

    users.unshift(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return newUser;
  }
};
