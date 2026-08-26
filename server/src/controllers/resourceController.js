import { Resource } from '../models/Resource.js';

const DEFAULT_RESOURCES = [
  {
    _id: 'r1',
    title: 'Complete Software Engineer Resume & Portfolio Template 2025',
    category: 'Resume & CV',
    fileType: 'PDF',
    description: 'ATS-optimized resume template with bullet-point action verbs and portfolio layout used by engineers at Google and Meta.',
    downloadCount: 1420,
    tags: ['Resume', 'Software Engineer', 'ATS', 'Portfolio'],
    fileUrl: '/uploads/sample-career-planning-guide.pdf',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'r2',
    title: 'Top 50 Data Science & Python Interview Questions Handbook',
    category: 'Interview Preparation',
    fileType: 'PDF',
    description: 'Comprehensive guide covering SQL queries, pandas dataframes, machine learning algorithms, and live coding exercises.',
    downloadCount: 980,
    tags: ['Data Science', 'Python', 'Interview Prep', 'SQL'],
    fileUrl: '/uploads/sample-career-planning-guide.pdf',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'r3',
    title: 'UI/UX Design System & Figma Component Kit',
    category: 'Tools & Templates',
    fileType: 'ZIP',
    description: 'Design system toolkit with auto-layout cards, color tokens, dark mode variants, and responsive navigation components.',
    downloadCount: 750,
    tags: ['UI UX', 'Figma', 'Design System', 'Templates'],
    fileUrl: '/uploads/sample-career-planning-guide.pdf',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'r4',
    title: 'DevOps & AWS Cloud Security Roadmap Guide',
    category: 'Career Guides',
    fileType: 'PDF',
    description: 'Step-by-step roadmap from Linux basics to Docker, Kubernetes, Terraform, and AWS Solutions Architect certification.',
    downloadCount: 1120,
    tags: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
    fileUrl: '/uploads/sample-career-planning-guide.pdf',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'r5',
    title: 'Product Management Strategy & PRD Specification Template',
    category: 'Tools & Templates',
    fileType: 'DOCX',
    description: 'Standard Product Requirement Document (PRD) template for scoping features, metrics (OKRs/KPIs), and user stories.',
    downloadCount: 630,
    tags: ['Product Management', 'PRD', 'Agile', 'Templates'],
    fileUrl: '/uploads/sample-career-planning-guide.pdf',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'r6',
    title: 'Cybersecurity Threat Modeling & Ethical Hacking Basics',
    category: 'Skill Development',
    fileType: 'PDF',
    description: 'Introduction to network penetration testing, OWASP Top 10 vulnerabilities, and security auditing tools.',
    downloadCount: 890,
    tags: ['Cybersecurity', 'Ethical Hacking', 'OWASP', 'Penetration Testing'],
    fileUrl: '/uploads/sample-career-planning-guide.pdf',
    createdAt: new Date().toISOString(),
  },
];

export const getResources = async (req, res, next) => {
  try {
    const { category, type, search } = req.query;
    const filter = {};

    if (category && category !== 'All' && category !== 'All Categories') {
      filter.category = { $regex: new RegExp(category, 'i') };
    }
    if (type && type !== 'All' && type !== 'All Types') {
      filter.fileType = { $regex: new RegExp(type, 'i') };
    }
    if (search && search.trim() !== '') {
      const s = search.trim();
      filter.$or = [
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { tags: { $regex: s, $options: 'i' } },
        { category: { $regex: s, $options: 'i' } },
      ];
    }

    let resources = [];
    try {
      resources = await Resource.find(filter).sort({ createdAt: -1 });
    } catch (e) {
      console.warn('[Resources DB Notice] Using fallback static dataset:', e.message);
    }

    if (!resources || resources.length === 0) {
      let filtered = [...DEFAULT_RESOURCES];
      if (category && category !== 'All' && category !== 'All Categories') {
        filtered = filtered.filter((r) => r.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (type && type !== 'All' && type !== 'All Types') {
        filtered = filtered.filter((r) => r.fileType.toLowerCase() === type.toLowerCase());
      }
      if (search && search.trim() !== '') {
        const s = search.trim().toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(s) ||
            r.description.toLowerCase().includes(s) ||
            r.category.toLowerCase().includes(s) ||
            r.tags.some((t) => t.toLowerCase().includes(s))
        );
      }
      resources = filtered;
    }

    res.json({ success: true, resources });
  } catch (error) {
    next(error);
  }
};

export const downloadResource = async (req, res, next) => {
  try {
    let resource = null;
    try {
      resource = await Resource.findById(req.params.id);
      if (resource) {
        resource.downloadCount += 1;
        await resource.save();
      }
    } catch (e) {}

    if (!resource) {
      resource = DEFAULT_RESOURCES.find((r) => r._id === req.params.id) || DEFAULT_RESOURCES[0];
    }

    res.json({
      success: true,
      message: 'Download initiated.',
      fileUrl: resource.fileUrl,
      downloadCount: (resource.downloadCount || 100) + 1,
    });
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Resource created successfully!', resource });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }
    res.json({ success: true, message: 'Resource updated!', resource });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }
    res.json({ success: true, message: 'Resource deleted!' });
  } catch (error) {
    next(error);
  }
};
