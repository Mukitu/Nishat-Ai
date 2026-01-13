import React, { useState } from 'react';
import { Scale, Sparkles, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { analyzeDecision } from '@/services/n8nService';
import { toast } from 'sonner';

interface DecisionResult {
  pros: string[];
  cons: string[];
  risks: string[];
  benefits: string[];
  recommendation: string;
  confidence: number;
}

export default function DecisionEngine() {
  const [problem, setProblem] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const handleAnalyze = async () => {
    if (!problem.trim()) return;
    setIsAnalyzing(true);

    try {
      const analysisResult = await analyzeDecision(problem);
      setResult(analysisResult);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Analysis failed', {
        description: 'Please check your n8n webhook configuration',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-4xl mx-auto">
        <PageHeader
          title="Decision Support Engine"
          description="AI-powered analysis for better decision making"
        />

        {/* Input Section */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-semibold mb-4">Describe your decision or problem</h3>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Example: Should I migrate our monolithic application to microservices architecture? Consider our team of 5 developers, moderate traffic, and plans for 3x growth in the next 2 years..."
            className="input-field min-h-[150px] mb-4"
          />
          <button
            onClick={handleAnalyze}
            disabled={!problem.trim() || isAnalyzing}
            className="btn-primary w-full sm:w-auto"
          >
            <Sparkles className={cn('w-4 h-4 mr-2', isAnalyzing && 'animate-spin')} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Decision'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Confidence Score */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">AI Confidence Score</h3>
                <span className="text-2xl font-bold text-primary">{result.confidence}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${result.confidence}%`,
                    background: 'var(--gradient-primary)',
                  }}
                />
              </div>
            </div>

            {/* Pros & Cons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pros */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-success">
                  <ThumbsUp className="w-5 h-5" />
                  Pros
                </h3>
                <ul className="space-y-3">
                  {result.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span className="text-sm">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-destructive">
                  <ThumbsDown className="w-5 h-5" />
                  Cons
                </h3>
                <ul className="space-y-3">
                  {result.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Risks & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risks */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  Potential Risks
                </h3>
                <ul className="space-y-3">
                  {result.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                  <Lightbulb className="w-5 h-5" />
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {result.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation */}
            <div className="glass-card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                AI Recommendation
              </h3>
              <p className="text-muted-foreground leading-relaxed">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
