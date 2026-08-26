import jsPDF from 'jspdf';

export interface ResourceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  fileType: string;
  fileSize?: string;
  pagesCount?: string;
  rating?: string;
  difficulty?: string;
  author?: string;
  downloadCount: number;
  tags: string[];
  outline?: string[];
  detailedContent?: string[];
}

export const generateResourcePdf = (resource: ResourceItem) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = '#4F20C9'; // Deep Indigo
  const darkTextColor = '#07031A'; // Deep Dark
  const textMuted = '#64748B'; // Muted Slate
  const accentGold = '#D97706';

  let currentY = 20;

  // 1. Header Banner
  doc.setFillColor(79, 32, 201); // #4F20C9
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PATHSEEKER CAREER PASSPORT ARCHIVE', 15, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('OFFICIAL VERIFIED LEARNING & CAREER ASSET • 2025 EDITION', 15, 21);

  currentY = 40;

  // 2. Document Title
  doc.setTextColor(darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(resource.title, 180);
  doc.text(titleLines, 15, currentY);
  currentY += titleLines.length * 8 + 4;

  // 3. Category & Difficulty Badge Bar
  doc.setFillColor(243, 232, 255); // Purple 50
  doc.roundedRect(15, currentY, 180, 14, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(79, 32, 201);
  doc.text(`CATEGORY: ${(resource.category || 'CAREER GUIDE').toUpperCase()}`, 20, currentY + 9);
  doc.text(`FORMAT: ${resource.fileType || 'PDF'} (${resource.fileSize || '3.5 MB'})`, 95, currentY + 9);
  doc.text(`DIFFICULTY: ${resource.difficulty || 'Intermediate'}`, 155, currentY + 9);

  currentY += 22;

  // 4. Executive Summary
  doc.setTextColor(darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Executive Overview & Purpose', 15, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(resource.description, 180);
  doc.text(descLines, 15, currentY);
  currentY += descLines.length * 6 + 10;

  // 5. Document Outline / Table of Contents
  if (resource.outline && resource.outline.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(darkTextColor);
    doc.text('Document Structure & Core Modules', 15, currentY);
    currentY += 7;

    resource.outline.forEach((item, idx) => {
      doc.setFillColor(79, 32, 201);
      doc.circle(18, currentY - 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'semibold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      const itemLines = doc.splitTextToSize(`Module ${idx + 1}: ${item}`, 170);
      doc.text(itemLines, 23, currentY);
      currentY += itemLines.length * 6 + 2;
    });

    currentY += 8;
  }

  // 6. Detailed Chapter Content
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkTextColor);
  doc.text('Key Technical Guidance & Action Steps', 15, currentY);
  currentY += 7;

  const contentList = resource.detailedContent || [
    'Stage 1: Master Fundamentals & Core Architectural Concepts - Build robust foundational understanding.',
    'Stage 2: Construct Real-World Portfolio Projects - Document code repositories with clear READMEs and architecture diagrams.',
    'Stage 3: ATS Resume Optimization - Quantify your achievements with action verbs and metric impact.',
    'Stage 4: Technical & System Design Interviews - Practice algorithmic problem solving and trade-off discussions.',
    'Stage 5: Continuous Growth & Career Advancement - Stay aligned with industry hiring trends and salary benchmarks.',
  ];

  contentList.forEach((line) => {
    if (currentY > 260) {
      doc.addPage();
      currentY = 25;
    }

    doc.setFillColor(241, 245, 249);
    doc.rect(15, currentY, 180, 0.5, 'F');
    currentY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(line, 180);
    doc.text(lines, 15, currentY);
    currentY += lines.length * 5 + 4;
  });

  // 7. Footer Watermark on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 280, 195, 280);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('PathSeeker Career Platform • Verified Resource Download', 15, 286);
    doc.text(`Page ${i} of ${totalPages}`, 175, 286);
  }

  const cleanFilename = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(cleanFilename);
};
