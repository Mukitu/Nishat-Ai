import jsPDF from 'jspdf';

export interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    summary: string;
  };
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    description: string;
  }>;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    tech: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}

type Template = 'modern' | 'classic' | 'minimal';

export function generatePDF(cvData: CVData, template: Template = 'modern'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Color schemes based on template
  const colors = {
    modern: { primary: [20, 184, 166], secondary: [100, 116, 139], text: [30, 41, 59] },
    classic: { primary: [59, 130, 246], secondary: [107, 114, 128], text: [17, 24, 39] },
    minimal: { primary: [0, 0, 0], secondary: [75, 85, 99], text: [31, 41, 55] },
  };

  const scheme = colors[template];

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 5): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Helper to check and add new page if needed
  const checkNewPage = (requiredSpace: number): void => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header Section
  doc.setFillColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
  if (template === 'modern') {
    doc.rect(0, 0, pageWidth, 45, 'F');
    doc.setTextColor(255, 255, 255);
  } else {
    doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
  }

  // Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const nameY = template === 'modern' ? 20 : margin;
  doc.text(cvData.personalInfo.fullName || 'Your Name', margin, nameY);

  // Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  if (template !== 'modern') {
    doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
  }
  doc.text(cvData.personalInfo.title || 'Professional Title', margin, nameY + 8);

  // Contact Info
  doc.setFontSize(9);
  if (template === 'modern') {
    doc.setTextColor(220, 220, 220);
  } else {
    doc.setTextColor(scheme.secondary[0], scheme.secondary[1], scheme.secondary[2]);
  }

  const contactParts: string[] = [];
  if (cvData.personalInfo.email) contactParts.push(cvData.personalInfo.email);
  if (cvData.personalInfo.phone) contactParts.push(cvData.personalInfo.phone);
  if (cvData.personalInfo.location) contactParts.push(cvData.personalInfo.location);
  
  const contactLine = contactParts.join('  |  ');
  doc.text(contactLine, margin, nameY + 15);

  const linkParts: string[] = [];
  if (cvData.personalInfo.website) linkParts.push(cvData.personalInfo.website);
  if (cvData.personalInfo.linkedin) linkParts.push(cvData.personalInfo.linkedin);
  if (cvData.personalInfo.github) linkParts.push(cvData.personalInfo.github);
  
  if (linkParts.length > 0) {
    doc.text(linkParts.join('  |  '), margin, nameY + 20);
  }

  yPosition = template === 'modern' ? 55 : margin + 35;

  // Reset text color for content
  doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);

  // Summary Section
  if (cvData.personalInfo.summary) {
    checkNewPage(25);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
    doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
    
    yPosition += 2;
    doc.setDrawColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, margin + 40, yPosition);
    
    yPosition += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
    yPosition = addWrappedText(cvData.personalInfo.summary, margin, yPosition, contentWidth);
    yPosition += 8;
  }

  // Skills Section
  if (cvData.skills.length > 0) {
    checkNewPage(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
    doc.text('SKILLS', margin, yPosition);
    
    yPosition += 2;
    doc.line(margin, yPosition, margin + 15, yPosition);
    
    yPosition += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
    
    const skillsText = cvData.skills.join('  •  ');
    yPosition = addWrappedText(skillsText, margin, yPosition, contentWidth);
    yPosition += 8;
  }

  // Experience Section
  if (cvData.experience.length > 0) {
    checkNewPage(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
    doc.text('EXPERIENCE', margin, yPosition);
    
    yPosition += 2;
    doc.line(margin, yPosition, margin + 25, yPosition);
    yPosition += 5;

    cvData.experience.forEach((exp) => {
      checkNewPage(25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
      doc.text(exp.title || 'Job Title', margin, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(scheme.secondary[0], scheme.secondary[1], scheme.secondary[2]);
      doc.text(exp.duration || '', pageWidth - margin, yPosition, { align: 'right' });
      
      yPosition += 5;
      doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
      doc.text(exp.company || 'Company', margin, yPosition);
      
      if (exp.description) {
        yPosition += 5;
        doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
        yPosition = addWrappedText(exp.description, margin, yPosition, contentWidth);
      }
      yPosition += 6;
    });
  }

  // Education Section
  if (cvData.education.length > 0) {
    checkNewPage(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
    doc.text('EDUCATION', margin, yPosition);
    
    yPosition += 2;
    doc.line(margin, yPosition, margin + 23, yPosition);
    yPosition += 5;

    cvData.education.forEach((edu) => {
      checkNewPage(20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
      doc.text(edu.degree || 'Degree', margin, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(scheme.secondary[0], scheme.secondary[1], scheme.secondary[2]);
      doc.text(edu.year || '', pageWidth - margin, yPosition, { align: 'right' });
      
      yPosition += 5;
      doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
      doc.text(edu.institution || 'Institution', margin, yPosition);
      
      if (edu.description) {
        yPosition += 5;
        doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
        yPosition = addWrappedText(edu.description, margin, yPosition, contentWidth);
      }
      yPosition += 6;
    });
  }

  // Projects Section
  if (cvData.projects && cvData.projects.length > 0) {
    checkNewPage(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
    doc.text('PROJECTS', margin, yPosition);
    
    yPosition += 2;
    doc.line(margin, yPosition, margin + 20, yPosition);
    yPosition += 5;

    cvData.projects.forEach((project) => {
      checkNewPage(20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
      doc.text(project.name || 'Project Name', margin, yPosition);
      
      if (project.tech) {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(scheme.secondary[0], scheme.secondary[1], scheme.secondary[2]);
        doc.text(project.tech, pageWidth - margin, yPosition, { align: 'right' });
      }
      
      if (project.description) {
        yPosition += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
        yPosition = addWrappedText(project.description, margin, yPosition, contentWidth);
      }
      yPosition += 6;
    });
  }

  // Certifications Section
  if (cvData.certifications && cvData.certifications.length > 0) {
    checkNewPage(15);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
    doc.text('CERTIFICATIONS', margin, yPosition);
    
    yPosition += 2;
    doc.line(margin, yPosition, margin + 30, yPosition);
    yPosition += 5;

    cvData.certifications.forEach((cert) => {
      checkNewPage(10);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
      doc.text(`${cert.name} - ${cert.issuer} (${cert.year})`, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  }

  // Languages Section
  if (cvData.languages && cvData.languages.length > 0) {
    checkNewPage(15);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scheme.primary[0], scheme.primary[1], scheme.primary[2]);
    doc.text('LANGUAGES', margin, yPosition);
    
    yPosition += 2;
    doc.line(margin, yPosition, margin + 22, yPosition);
    yPosition += 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(scheme.text[0], scheme.text[1], scheme.text[2]);
    const langText = cvData.languages.map(l => `${l.name} (${l.level})`).join('  •  ');
    doc.text(langText, margin, yPosition);
  }

  // Generate filename and save
  const fileName = `${cvData.personalInfo.fullName.replace(/\s+/g, '_') || 'CV'}_Resume.pdf`;
  doc.save(fileName);
}
