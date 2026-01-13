import React, { useState } from 'react';
import {
  FileUser,
  Plus,
  Trash2,
  Download,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Languages,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { generatePDF, CVData } from '@/services/pdfService';
import { optimizeCV } from '@/services/n8nService';
import { toast } from 'sonner';

// CVData type is imported from pdfService

const defaultCVData: CVData = {
  personalInfo: {
    fullName: 'Mukitu Islam Nishat',
    title: 'Full Stack MERN Developer | AI & SaaS Architect',
    email: 'contact@mukitu.dev',
    phone: '+880 1XXX-XXXXXX',
    location: 'Bangladesh',
    website: 'mukitu.dev',
    linkedin: 'linkedin.com/in/mukitu',
    github: 'github.com/mukitu',
    summary: 'Professional Full Stack MERN Developer specializing in AI-driven SaaS solutions with 580+ successful client projects. Expert in building scalable, high-performance web applications using modern technologies.',
  },
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science & Engineering',
      institution: 'University Name',
      year: '2021 - Present',
      description: 'Specializing in Software Engineering, AI/ML, and Cloud Computing',
    },
  ],
  experience: [
    {
      id: '1',
      title: 'Full Stack Developer',
      company: 'Freelance / Self-Employed',
      duration: '2020 - Present',
      description: 'Delivered 580+ projects for international clients. Specialized in React, Node.js, AI integrations, and SaaS development.',
    },
  ],
  skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Python', 'AI/ML', 'AWS', 'Docker', 'GraphQL'],
  projects: [
    {
      id: '1',
      name: 'AI-Powered Analytics Platform',
      description: 'Enterprise analytics with real-time AI insights',
      tech: 'React, Node.js, TensorFlow, AWS',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
  ],
  languages: [
    { id: '1', name: 'English', level: 'Professional' },
    { id: '2', name: 'Bengali', level: 'Native' },
  ],
};

type Template = 'modern' | 'classic' | 'minimal';

export default function CVBuilder() {
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [template, setTemplate] = useState<Template>('modern');
  const [showPreview, setShowPreview] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handlePersonalInfoChange = (field: keyof CVData['personalInfo'], value: string) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addEducation = () => {
    setCVData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), degree: '', institution: '', year: '', description: '' },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addExperience = () => {
    setCVData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), title: '', company: '', duration: '', description: '' },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCVData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleAIOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeCV(cvData);
      
      // Apply optimized summary if available
      if (result.optimizedSummary && result.optimizedSummary !== cvData.personalInfo.summary) {
        setCVData((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, summary: result.optimizedSummary },
        }));
      }
      
      // Add suggested skills
      if (result.skillSuggestions && result.skillSuggestions.length > 0) {
        const newSkills = result.skillSuggestions.filter(s => !cvData.skills.includes(s));
        if (newSkills.length > 0) {
          setCVData((prev) => ({
            ...prev,
            skills: [...prev.skills, ...newSkills],
          }));
        }
      }
      
      toast.success(`CV Optimized! ATS Score: ${result.atsScore}%`, {
        description: result.improvementTips.join(' • '),
      });
    } catch (error) {
      toast.error('Optimization failed', {
        description: 'Please configure your n8n webhook in Settings',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      generatePDF(cvData, template);
      toast.success('PDF Downloaded!', {
        description: `${cvData.personalInfo.fullName}_Resume.pdf`,
      });
    } catch (error) {
      toast.error('PDF generation failed', {
        description: 'Please try again',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Professional CV Builder"
          description="Create ATS-friendly resumes with AI optimization"
          badge="Popular"
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-secondary"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={handleAIOptimize}
                disabled={isOptimizing}
                className="btn-secondary"
              >
                <Sparkles className={cn('w-4 h-4 mr-2', isOptimizing && 'animate-spin')} />
                AI Optimize
              </button>
              <button onClick={handleDownloadPDF} className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          }
        />

        {/* Template Selector */}
        <div className="flex gap-3 mb-6">
          {(['modern', 'classic', 'minimal'] as Template[]).map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium capitalize transition-all',
                template === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className={cn('grid gap-8', showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl')}>
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileUser className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Professional Title"
                  value={cvData.personalInfo.title}
                  onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="input-field"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={cvData.personalInfo.location}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Website"
                  value={cvData.personalInfo.website}
                  onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="LinkedIn"
                  value={cvData.personalInfo.linkedin}
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="GitHub"
                  value={cvData.personalInfo.github}
                  onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                  className="input-field"
                />
                <textarea
                  placeholder="Professional Summary"
                  value={cvData.personalInfo.summary}
                  onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                  className="input-field sm:col-span-2 min-h-[100px]"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {cvData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge-primary flex items-center gap-1 pr-1"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="p-0.5 hover:bg-primary/20 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  className="input-field flex-1"
                />
                <button onClick={addSkill} className="btn-secondary">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Experience */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Experience
                </h3>
                <button onClick={addExperience} className="btn-secondary">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {cvData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Experience {index + 1}</span>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => {
                        const updated = cvData.experience.map((item) =>
                          item.id === exp.id ? { ...item, title: e.target.value } : item
                        );
                        setCVData((prev) => ({ ...prev, experience: updated }));
                      }}
                      className="input-field"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = cvData.experience.map((item) =>
                            item.id === exp.id ? { ...item, company: e.target.value } : item
                          );
                          setCVData((prev) => ({ ...prev, experience: updated }));
                        }}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={exp.duration}
                        onChange={(e) => {
                          const updated = cvData.experience.map((item) =>
                            item.id === exp.id ? { ...item, duration: e.target.value } : item
                          );
                          setCVData((prev) => ({ ...prev, experience: updated }));
                        }}
                        className="input-field"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => {
                        const updated = cvData.experience.map((item) =>
                          item.id === exp.id ? { ...item, description: e.target.value } : item
                        );
                        setCVData((prev) => ({ ...prev, experience: updated }));
                      }}
                      className="input-field min-h-[80px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h3>
                <button onClick={addEducation} className="btn-secondary">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Education {index + 1}</span>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = cvData.education.map((item) =>
                          item.id === edu.id ? { ...item, degree: e.target.value } : item
                        );
                        setCVData((prev) => ({ ...prev, education: updated }));
                      }}
                      className="input-field"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = cvData.education.map((item) =>
                            item.id === edu.id ? { ...item, institution: e.target.value } : item
                          );
                          setCVData((prev) => ({ ...prev, education: updated }));
                        }}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => {
                          const updated = cvData.education.map((item) =>
                            item.id === edu.id ? { ...item, year: e.target.value } : item
                          );
                          setCVData((prev) => ({ ...prev, education: updated }));
                        }}
                        className="input-field"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="glass-card p-8 bg-white text-gray-900 h-fit sticky top-24">
              <div className={cn('cv-preview', template)}>
                {/* Header */}
                <div className="text-center mb-6 pb-6 border-b-2 border-gray-200">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {cvData.personalInfo.fullName || 'Your Name'}
                  </h1>
                  <p className="text-primary font-medium mb-3">
                    {cvData.personalInfo.title || 'Professional Title'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {cvData.personalInfo.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {cvData.personalInfo.email}
                      </span>
                    )}
                    {cvData.personalInfo.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {cvData.personalInfo.phone}
                      </span>
                    )}
                    {cvData.personalInfo.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {cvData.personalInfo.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {cvData.personalInfo.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {cvData.personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {cvData.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {cvData.experience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience</h2>
                    <div className="space-y-4">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">{exp.title || 'Job Title'}</h3>
                            <span className="text-sm text-gray-500">{exp.duration}</span>
                          </div>
                          <p className="text-sm text-primary">{exp.company}</p>
                          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {cvData.education.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                    <div className="space-y-3">
                      {cvData.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">{edu.degree || 'Degree'}</h3>
                            <span className="text-sm text-gray-500">{edu.year}</span>
                          </div>
                          <p className="text-sm text-primary">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
