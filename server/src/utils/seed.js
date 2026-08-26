import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore
}

dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), 'server', 'src', '.env') });
}

import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Career } from '../models/Career.js';
import { QuizQuestion } from '../models/QuizQuestion.js';
import { Multimedia } from '../models/Multimedia.js';
import { Resource } from '../models/Resource.js';
import { SuccessStory } from '../models/SuccessStory.js';
import { YOUTUBE_VIDEO_DATASET } from './videoData.js';

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB Atlas...');

    // Clear existing collections
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Career.deleteMany({});
    await QuizQuestion.deleteMany({});
    await Multimedia.deleteMany({});
    await Resource.deleteMany({});
    await SuccessStory.deleteMany({});

    console.log('[Seed] Cleared existing database collections.');

    // 1. Create System Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('420420420', salt);

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin420@gmail.com',
      passwordHash: adminPassword,
      role: 'admin',
      isVerified: true,
    });

    // Create admin profile
    await Profile.create({ userId: admin._id, educationLevel: 'Master Degree', bio: 'Platform Administrator' });

    console.log('[Seed] Default users & profiles created.');

    // 2. Create Careers
    const careers = await Career.insertMany([
      {
        title: 'Software Developer',
        domain: 'Technology',
        description: 'Design, build, and maintain modern software applications, microservices, and web systems.',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Data Structures', 'Git'],
        educationPath: 'Bachelor in Computer Science, Software Engineering or Coding Bootcamp certification.',
        expectedSalaryRange: { min: 85000, max: 155000, currency: 'USD' },
        demandLevel: 'high',
        growthRate: 'High Growth (22% YoY)',
        tags: ['Programming', 'Web', 'Full Stack', 'High Growth'],
        createdBy: admin._id,
      },
      {
        title: 'Data Scientist',
        domain: 'Technology',
        description: 'Analyze data and provide machine learning insights to drive executive decision-making.',
        requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Statistics'],
        educationPath: 'Bachelor or Master in Data Science, Statistics, Mathematics or Computer Science.',
        expectedSalaryRange: { min: 95000, max: 170000, currency: 'USD' },
        demandLevel: 'high',
        growthRate: 'High Growth (35% YoY)',
        tags: ['AI/ML', 'Analytics', 'Python', 'Big Data'],
        createdBy: admin._id,
      },
      {
        title: 'Product Manager',
        domain: 'Business',
        description: 'Plan, develop, and manage digital products that solve user problems and achieve business goals.',
        requiredSkills: ['Agile Methodologies', 'User Research', 'Product Roadmap', 'Wireframing', 'KPI Tracking'],
        educationPath: 'Bachelor in Business Administration, Computer Science, or Management with Agile PM certification.',
        expectedSalaryRange: { min: 90000, max: 160000, currency: 'USD' },
        demandLevel: 'high',
        growthRate: 'High Growth',
        tags: ['Product', 'Leadership', 'Agile', 'Strategy'],
        createdBy: admin._id,
      },
      {
        title: 'UX/UI Designer',
        domain: 'Design',
        description: 'Create meaningful, accessible, and engaging digital user experiences and interactive interfaces.',
        requiredSkills: ['Figma', 'Prototyping', 'User Research', 'Information Architecture', 'Design Systems'],
        educationPath: 'Degree in Graphic Design, Human-Computer Interaction (HCI), or UI Design certification.',
        expectedSalaryRange: { min: 75000, max: 135000, currency: 'USD' },
        demandLevel: 'medium',
        growthRate: 'High Growth',
        tags: ['Design', 'UI/UX', 'Figma', 'Creative'],
        createdBy: admin._id,
      },
      {
        title: 'Cyber Security Analyst',
        domain: 'Technology',
        description: 'Protect IT systems, network infrastructure, and critical cloud data from cyber threats and breaches.',
        requiredSkills: ['Ethical Hacking', 'Network Security', 'SIEM Tools', 'Incident Response', 'Python'],
        educationPath: 'Bachelor in Cybersecurity, IT Security or CompTIA Security+/CISSP Certification.',
        expectedSalaryRange: { min: 90000, max: 165000, currency: 'USD' },
        demandLevel: 'high',
        growthRate: 'High Growth (31% YoY)',
        tags: ['Security', 'Cloud', 'Network', 'High Demand'],
        createdBy: admin._id,
      },
      {
        title: 'Marketing Manager',
        domain: 'Business',
        description: 'Plan and execute omni-channel marketing strategies, digital growth campaigns, and brand awareness.',
        requiredSkills: ['SEO/SEM', 'Content Strategy', 'Google Analytics', 'Social Media Marketing', 'Copywriting'],
        educationPath: 'Degree in Marketing, Communications, Business Administration or Digital Media.',
        expectedSalaryRange: { min: 70000, max: 130000, currency: 'USD' },
        demandLevel: 'medium',
        growthRate: 'Moderate Growth',
        tags: ['Marketing', 'Branding', 'Digital Media'],
        createdBy: admin._id,
      },
      {
        title: 'Cloud Engineer',
        domain: 'Engineering',
        description: 'Architect, deploy, and manage scalable cloud infrastructure on AWS, Microsoft Azure, and GCP.',
        requiredSkills: ['AWS', 'Terraform', 'Linux', 'Kubernetes', 'CI/CD Pipelines'],
        educationPath: 'Degree in Computer Engineering or AWS Certified Solutions Architect credential.',
        expectedSalaryRange: { min: 100000, max: 175000, currency: 'USD' },
        demandLevel: 'high',
        growthRate: 'High Growth',
        tags: ['Cloud', 'DevOps', 'AWS', 'Infrastructure'],
        createdBy: admin._id,
      },
      {
        title: 'DevOps Engineer',
        domain: 'Engineering',
        description: 'Bridge the gap between software development and IT operations through automated deployment pipelines.',
        requiredSkills: ['Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'Shell Scripting'],
        educationPath: 'Degree in Computer Science or Software Engineering with CKA/Docker credentials.',
        expectedSalaryRange: { min: 105000, max: 180000, currency: 'USD' },
        demandLevel: 'high',
        growthRate: 'High Growth',
        tags: ['DevOps', 'Automation', 'CI/CD'],
        createdBy: admin._id,
      },
      {
        title: 'Business Analyst',
        domain: 'Business',
        description: 'Bridge technical software solutions with strategic enterprise business goals through data workflows.',
        requiredSkills: ['SQL', 'Tableau', 'Business Process Modeling', 'Requirements Gathering', 'Excel'],
        educationPath: 'Bachelor in Business Analytics, Finance, Information Systems, or MBA.',
        expectedSalaryRange: { min: 78000, max: 140000, currency: 'USD' },
        demandLevel: 'medium',
        growthRate: 'Moderate Growth',
        tags: ['Analytics', 'Business', 'Strategy'],
        createdBy: admin._id,
      },
      {
        title: 'AI / ML Engineer',
        domain: 'Technology',
        description: 'Build neural networks, LLM models, and intelligent AI applications that automate complex decisions.',
        requiredSkills: ['PyTorch', 'TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision', 'Python'],
        educationPath: 'Master or PhD in Artificial Intelligence, Computer Science, or Robotics.',
        expectedSalaryRange: { min: 115000, max: 210000, currency: 'USD' },
        demandLevel: 'high',
        growthRate: 'Explosive Growth (40% YoY)',
        tags: ['AI', 'Machine Learning', 'Deep Learning', 'High Paying'],
        createdBy: admin._id,
      },
    ]);

    console.log(`[Seed] Created ${careers.length} careers.`);

    // 3. Create Quiz Questions
    await QuizQuestion.insertMany([
      {
        questionText: 'Which of the following activities do you enjoy the most?',
        category: 'Interests',
        type: 'mcq',
        targetRole: 'all',
        options: [
          { label: 'Solving logic problems and writing code', value: 'solve_problems', scoreMap: { technology: 5, engineering: 3 } },
          { label: 'Designing visual interfaces and creative layouts', value: 'design_things', scoreMap: { design: 5, technology: 2 } },
          { label: 'Analyzing numerical data and financial trends', value: 'analyze_data', scoreMap: { technology: 3, business: 4 } },
          { label: 'Leading teams and building product strategies', value: 'lead_team', scoreMap: { business: 5, education: 2 } },
          { label: 'Helping people improve their health and wellbeing', value: 'help_people', scoreMap: { healthcare: 5, education: 3 } },
        ],
        createdBy: admin._id,
      },
      {
        questionText: 'What type of working environment empowers you best?',
        category: 'Work Style',
        type: 'mcq',
        targetRole: 'all',
        options: [
          { label: 'Fast-paced tech startup with remote flexibility', value: 'startup', scoreMap: { technology: 4, design: 3 } },
          { label: 'Structured enterprise corporate office with clear career tiers', value: 'corporate', scoreMap: { business: 5, law: 4 } },
          { label: 'Collaborative research laboratory or healthcare facility', value: 'lab', scoreMap: { healthcare: 5, engineering: 3 } },
          { label: 'Independent freelancing or agency consulting', value: 'freelance', scoreMap: { design: 5, business: 2 } },
        ],
        createdBy: admin._id,
      },
      {
        questionText: 'How comfortable are you with quantitative mathematics and statistical analysis?',
        category: 'Skills',
        type: 'mcq',
        targetRole: 'all',
        options: [
          { label: 'Extremely passionate — I love data models & probability', value: 'high_math', scoreMap: { technology: 5, engineering: 4 } },
          { label: 'Moderate — I use metrics to make business decisions', value: 'mod_math', scoreMap: { business: 4, design: 1 } },
          { label: 'Prefer visual and qualitative creative tasks over numbers', value: 'low_math', scoreMap: { design: 5, education: 4 } },
        ],
        createdBy: admin._id,
      },
      {
        questionText: 'What primary reward matters most in your ideal career choice?',
        category: 'Values',
        type: 'mcq',
        targetRole: 'all',
        options: [
          { label: 'High compensation and financial independence', value: 'high_pay', scoreMap: { technology: 4, business: 4 } },
          { label: 'Creative autonomy and design freedom', value: 'creativity', scoreMap: { design: 5, technology: 2 } },
          { label: 'Social impact and community contribution', value: 'social_impact', scoreMap: { healthcare: 5, education: 5 } },
          { label: 'Stability, prestige, and job security', value: 'stability', scoreMap: { engineering: 4, law: 5 } },
        ],
        createdBy: admin._id,
      },
    ]);

    console.log('[Seed] Quiz questions created.');

    // 4. Create Multimedia Items (105+ videos across 7 categories)
    const formattedVideos = YOUTUBE_VIDEO_DATASET.map((v, i) => ({
      title: v.title,
      youtubeVideoId: v.youtubeVideoId,
      url: `https://www.youtube.com/watch?v=${v.youtubeVideoId}`,
      type: 'video',
      category: v.category,
      duration: v.duration,
      ratingAvg: 4.8 + (i % 3) * 0.1,
      ratingCount: 150 + i * 12,
      tags: v.tags,
      transcript: v.description,
      careerId: careers[i % careers.length]._id,
    }));
    await Multimedia.insertMany(formattedVideos);

    console.log(`[Seed] ${formattedVideos.length} Multimedia videos created across 7 categories.`);

    // 5. Create Resources matching Mockup 3
    await Resource.insertMany([
      {
        title: 'Career Planning Guide 2025',
        category: 'Career Guides',
        description: 'A complete step-by-step roadmap to plan your high-growth career path.',
        fileUrl: '/uploads/sample-career-planning-guide.pdf',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        tags: ['Roadmap', 'Planning', 'Guide'],
        downloadCount: 1420,
        createdBy: admin._id,
      },
      {
        title: 'Top In-Demand Jobs of 2025',
        category: 'Industry Insights',
        description: 'Explore the most in-demand global career roles and future technology trends.',
        fileUrl: '/uploads/sample-in-demand-jobs.pdf',
        fileType: 'PDF',
        fileSize: '3.1 MB',
        tags: ['Trends', 'Salary', 'Jobs'],
        downloadCount: 980,
        createdBy: admin._id,
      },
      {
        title: 'How to Choose the Right Career',
        category: 'Personal Growth',
        description: 'Expert tips and psychological frameworks to find the perfect career path matching your personality.',
        fileUrl: 'https://youtube.com/watch?example',
        fileType: 'Video',
        fileSize: '18 min',
        tags: ['Decision', 'Psychology'],
        downloadCount: 650,
        createdBy: admin._id,
      },
      {
        title: 'Resume Template Professional',
        category: 'Resume & CV',
        description: 'ATS-friendly professional resume template designed to stand out to hiring managers.',
        fileUrl: '/uploads/sample-resume-template.docx',
        fileType: 'DOCX',
        fileSize: '97 KB',
        tags: ['Resume', 'ATS', 'Template'],
        downloadCount: 2310,
        createdBy: admin._id,
      },
      {
        title: 'Python Cheat Sheet for Data Science',
        category: 'Skill Development',
        description: 'Essential Python commands, NumPy arrays, Pandas DataFrames, and Matplotlib syntax.',
        fileUrl: '/uploads/python-cheat-sheet.pdf',
        fileType: 'PDF',
        fileSize: '1.2 MB',
        tags: ['Python', 'Cheat Sheet', 'Coding'],
        downloadCount: 1840,
        createdBy: admin._id,
      },
      {
        title: 'Behavioral Interview Question Vault',
        category: 'Interview Preparation',
        description: 'Top 50 behavioral interview questions with structured STAR method sample answers.',
        fileUrl: '/uploads/behavioral-interview-questions.pdf',
        fileType: 'PDF',
        fileSize: '1.8 MB',
        tags: ['Interview', 'STAR Method'],
        downloadCount: 1560,
        createdBy: admin._id,
      },
    ]);

    console.log('[Seed] Resources created.');

    // 6. Create Approved Success Stories
    await SuccessStory.insertMany([
      {
        authorName: 'Sarah Lin',
        domain: 'Technology',
        headline: 'From Bootcamp Student to Senior React Engineer at Stripe',
        storyText: 'PathSeeker helped me map my self-taught learning journey, focus on high-impact full-stack projects, and prepare for tough technical interviews.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        timeline: [
          { year: '2022', title: 'Took PathSeeker Quiz', description: 'Identified strong aptitude for Software Engineering' },
          { year: '2023', title: 'Built Full Stack Portfolio', description: 'Created 4 full-stack open source web apps' },
          { year: '2024', title: 'Landed Senior Role', description: 'Joined Stripe as Software Engineer II' },
        ],
        status: 'approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        authorName: 'Michael Chang',
        domain: 'Data Science',
        headline: 'Transitioning from Mechanical Engineering to Lead Data Analyst',
        storyText: 'The personalized career match scores gave me the confidence to pivot into machine learning and business intelligence.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        timeline: [
          { year: '2023', title: 'Career Pivot Decision', description: 'Enrolled in Python Data Science specialization' },
          { year: '2024', title: 'Hired as Analyst', description: 'Joined Deloitte Data Advisory team' },
        ],
        status: 'approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
    ]);

    console.log('[Seed] Success stories created.');

    console.log('\n======================================================');
    console.log('SUCCESS: Database seeded successfully!');
    console.log('Default Credentials:');
    console.log('  Admin:        admin@pathseeker.com        / Admin@123456');
    console.log('  Student:      student@pathseeker.com      / Student@123456');
    console.log('  Graduate:     graduate@pathseeker.com     / Graduate@123456');
    console.log('  Professional: pro@pathseeker.com          / Pro@123456');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDB();
