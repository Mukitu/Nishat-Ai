import React, { useState, useRef } from 'react';
import { BarChart3, Upload, Sparkles, Image, X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';

interface ReportAnalysis {
  overview: string;
  highlights: Array<{
    title: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
    change: string;
  }>;
  insights: string[];
  recommendations: string[];
  risks: string[];
}

export default function ReportAnalyzer() {
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReportAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (files.length === 0) return;
    setIsAnalyzing(true);

    // Simulate AI analysis (replace with n8n webhook)
    setTimeout(() => {
      setResult({
        overview: 'The report indicates strong performance in Q3 2024 with notable growth in key metrics. Revenue increased by 23% compared to the previous quarter, driven primarily by new product launches and expanded market presence. Customer acquisition costs decreased while retention rates improved significantly.',
        highlights: [
          { title: 'Revenue Growth', value: '$2.4M', trend: 'up', change: '+23%' },
          { title: 'Active Users', value: '145K', trend: 'up', change: '+18%' },
          { title: 'CAC', value: '$42', trend: 'down', change: '-15%' },
          { title: 'Retention Rate', value: '94%', trend: 'up', change: '+5%' },
        ],
        insights: [
          'Mobile traffic increased by 45%, indicating strong mobile-first strategy success',
          'Enterprise segment showing highest growth potential with 67% quarter-over-quarter increase',
          'Customer lifetime value improved due to successful upselling initiatives',
          'Marketing efficiency improved with better targeting and automation',
        ],
        recommendations: [
          'Increase investment in mobile app development and optimization',
          'Expand enterprise sales team to capitalize on growing demand',
          'Implement advanced analytics for better customer segmentation',
          'Consider international expansion in European markets',
        ],
        risks: [
          'Increased competition in the SMB segment may affect growth',
          'Dependency on single payment provider poses operational risk',
          'Technical debt may slow down feature development velocity',
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-4xl mx-auto">
        <PageHeader
          title="Smart Report Analyzer"
          description="AI-powered analysis for reports and images"
        />

        {/* Upload Section */}
        <div className="glass-card p-6 mb-8">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
              multiple
              className="hidden"
            />
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Upload Reports or Images</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Supports PDF, Images (PNG, JPG), Excel, and CSV files
            </p>
            <button className="btn-secondary">
              <Upload className="w-4 h-4 mr-2" />
              Select Files
            </button>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={files.length === 0 || isAnalyzing}
            className="btn-primary mt-4"
          >
            <Sparkles className={cn('w-4 h-4 mr-2', isAnalyzing && 'animate-spin')} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Reports'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Overview */}
            <div className="glass-card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Overview
              </h3>
              <p className="text-muted-foreground leading-relaxed">{result.overview}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.highlights.map((highlight, index) => (
                <div key={index} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{highlight.title}</span>
                    {highlight.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : highlight.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    ) : null}
                  </div>
                  <p className="text-2xl font-bold">{highlight.value}</p>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      highlight.trend === 'up' && 'text-success',
                      highlight.trend === 'down' && 'text-success' // down is good for CAC
                    )}
                  >
                    {highlight.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Key Insights
              </h3>
              <ul className="space-y-3">
                {result.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                    <span className="text-muted-foreground">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  Potential Risks
                </h3>
                <ul className="space-y-3">
                  {result.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
