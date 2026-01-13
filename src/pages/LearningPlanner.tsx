import React, { useState } from 'react';
import { GraduationCap, Sparkles, Target, Clock, BookOpen, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { generateLearningPlan } from '@/services/n8nService';
import { toast } from 'sonner';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: string[];
  completed: boolean;
}

interface LearningPlan {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  roadmap: RoadmapItem[];
  tips: string[];
}

export default function LearningPlanner() {
  const [skill, setSkill] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<LearningPlan | null>(null);

  const handleGenerate = async () => {
    if (!skill.trim()) return;
    setIsGenerating(true);

    try {
      const generatedPlan = await generateLearningPlan(skill);
      setPlan(generatedPlan);
      toast.success('Learning plan generated!');
    } catch (error) {
      toast.error('Generation failed', {
        description: 'Please check your n8n webhook configuration',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleComplete = (id: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      roadmap: plan.roadmap.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  const completedCount = plan?.roadmap.filter((item) => item.completed).length || 0;
  const progressPercentage = plan ? (completedCount / plan.roadmap.length) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-4xl mx-auto">
        <PageHeader
          title="Learning & Skill Planner"
          description="Generate personalized learning roadmaps with AI"
        />

        {/* Input Section */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-semibold mb-4">What skill do you want to learn?</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g., React.js, Machine Learning, UI/UX Design, Python..."
              className="input-field flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={!skill.trim() || isGenerating}
              className="btn-primary"
            >
              <Sparkles className={cn('w-4 h-4 mr-2', isGenerating && 'animate-spin')} />
              {isGenerating ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </div>

        {/* Learning Plan */}
        {plan && (
          <div className="space-y-6 animate-slide-up">
            {/* Overview Card */}
            <div className="glass-card-elevated p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{plan.skill}</h2>
                  <p className="text-muted-foreground">
                    Estimated time: {plan.estimatedTime} • Level: {plan.level}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completedCount} / {plan.roadmap.length} completed</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercentage}%`,
                    background: 'var(--gradient-primary)',
                  }}
                />
              </div>
            </div>

            {/* Roadmap */}
            <div>
              <h3 className="section-title mb-4">Learning Roadmap</h3>
              <div className="space-y-4">
                {plan.roadmap.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      'glass-card p-6 transition-all duration-300',
                      item.completed && 'bg-success/5 border-success/20'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={cn(
                          'mt-1 shrink-0 transition-colors',
                          item.completed ? 'text-success' : 'text-muted-foreground hover:text-primary'
                        )}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="badge-primary">Step {index + 1}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {item.duration}
                          </span>
                        </div>
                        <h4 className={cn(
                          'font-semibold text-lg mb-1',
                          item.completed && 'line-through text-muted-foreground'
                        )}>
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.resources.map((resource) => (
                            <span
                              key={resource}
                              className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground"
                            >
                              <BookOpen className="w-3 h-3 inline mr-1" />
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Study Tips for Success
              </h3>
              <ul className="space-y-3">
                {plan.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
