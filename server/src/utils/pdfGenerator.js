import PDFDocument from 'pdfkit';

export const generateBookmarksPDF = (user, bookmarks, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=PathSeeker-CareerPassport-${user.name.replace(/\s+/g, '_')}.pdf`
  );

  doc.pipe(res);

  // Header Banner
  doc.fillColor('#5D5FEF').fontSize(24).text('PathSeeker Career Passport', { align: 'center' });
  doc.fontSize(12).fillColor('#666666').text('Personalized Career Recommendations & Saved Notes', { align: 'center' });
  doc.moveDown(1.5);

  // User Overview
  doc.fillColor('#1E293B').fontSize(14).text(`User Details:`, { underline: true });
  doc.fontSize(11).fillColor('#334155').text(`Name: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Role: ${user.role.toUpperCase()}`);
  doc.text(`Generated On: ${new Date().toLocaleDateString()}`);
  doc.moveDown(1.5);

  // Bookmarks Section
  doc.fillColor('#5D5FEF').fontSize(16).text('Saved Bookmarks & Notes:', { underline: true });
  doc.moveDown(1);

  if (bookmarks.length === 0) {
    doc.fontSize(11).fillColor('#64748B').text('No bookmarks saved yet.');
  } else {
    bookmarks.forEach((item, index) => {
      doc.fillColor('#0F172A').fontSize(12).text(`${index + 1}. [${item.itemType.toUpperCase()}] ${item.title}`);
      doc.fontSize(10).fillColor('#64748B').text(`Category: ${item.category || 'General'}`);
      if (item.note) {
        doc.fillColor('#334155').text(`Note: ${item.note}`);
      }
      doc.moveDown(0.8);
    });
  }

  doc.moveDown(2);
  doc.fillColor('#94A3B8').fontSize(9).text('Generated automatically by PathSeeker Career Guidance Platform.', {
    align: 'center',
  });

  doc.end();
};
