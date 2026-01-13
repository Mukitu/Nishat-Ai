import React from 'react';
import {
  Bot,
  Scale,
  FileText,
  BarChart3,
  GraduationCap,
  Lightbulb,
  FileUser,
  Zap,
  Activity,
  Clock,
  CheckCircle,
  MessageSquare,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FeatureCard } from '@/components/dashboard/FeatureCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { PageHeader } from '@/components/ui/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: Bot,
    title: 'AI Personal Assistant',
    description: 'Get intelligent responses powered by Gemini & DeepSeek with multi-language support.',
    path: '/ai-assistant',
    badge: 'AI',
    gradient: true,
  },
  {
    icon: Scale,
    title: 'Decision Support Engine',
    description: 'AI-powered pros & cons analysis for better decision making.',
    path: '/decision-engine',
  },
  {
    icon: FileText,
    title: 'Document Analyzer',
    description: 'Upload documents for AI-powered summaries and key insights extraction.',
    path: '/document-analyzer',
  },
  {
    icon: BarChart3,
    title: 'Report Analyzer',
    description: 'Analyze reports and images for structured summaries and recommendations.',
    path: '/report-analyzer',
  },
  {
    icon: GraduationCap,
    title: 'Learning Planner',
    description: 'Generate personalized learning roadmaps and study strategies.',
    path: '/learning-planner',
  },
  {
    icon: Lightbulb,
    title: 'Knowledge Hub',
    description: 'Daily productivity tips and AI-generated learning content.',
    path: '/knowledge-hub',
  },
  {
    icon: FileUser,
    title: 'CV Builder',
    description: 'Create professional, ATS-friendly resumes with AI optimization.',
    path: '/cv-builder',
    badge: 'Popular',
  },
];

const stats = [
  { icon: MessageSquare, label: 'AI Conversations', value: '1,284', change: { value: 12, type: 'increase' as const } },
  { icon: FileCheck, label: 'Documents Analyzed', value: '328', change: { value: 8, type: 'increase' as const } },
  { icon: TrendingUp, label: 'Decisions Made', value: '156', change: { value: 24, type: 'increase' as const } },
  { icon: Clock, label: 'Hours Saved', value: '89h', change: { value: 15, type: 'increase' as const } },
];

const recentActivity = [
  {
    icon: Bot,
    title: 'AI Assistant Query',
    description: 'Generated response for project planning question',
    time: '2 min ago',
    type: 'primary' as const,
  },
  {
    icon: FileText,
    title: 'Document Analyzed',
    description: 'Processed quarterly report with 12 key insights',
    time: '15 min ago',
    type: 'success' as const,
  },
  {
    icon: FileUser,
    title: 'CV Updated',
    description: 'Added new project experience and skills',
    time: '1 hour ago',
    type: 'primary' as const,
  },
  {
    icon: Scale,
    title: 'Decision Analysis',
    description: 'Completed pros/cons analysis for tech stack',
    time: '3 hours ago',
    type: 'warning' as const,
  },
];

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title={`${t('welcome')}, Mukitu 👋`}
          description="Here's what's happening with your AI-powered workspace today."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features Grid */}
          <div className="lg:col-span-2">
            <h2 className="section-title mb-4">{t('quickActions')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={feature.path} className="animate-slide-up" style={{ animationDelay: `${(index + 4) * 50}ms` }}>
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <h2 className="section-title mb-4">{t('recentActivity')}</h2>
            <div className="glass-card p-2">
              {recentActivity.map((activity, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${(index + 8) * 50}ms` }}>
                  <ActivityItem {...activity} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 glass-card p-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Pro Tip</h3>
              <p className="text-sm text-muted-foreground">Get the most out of your AI workspace</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Connect your n8n instance to enable real-time AI processing. All your data stays local,
            and you get the power of both Gemini and DeepSeek for comprehensive analysis.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
