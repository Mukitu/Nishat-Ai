import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, FileUp, X, CheckCircle, ListChecks, Key, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { analyzeDocument } from '@/services/n8nService';
import { toast } from 'sonner';

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  wordCount: number;
  readingTime: string;
}

export default function DocumentAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Read text file content
      if (selectedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setText(event.target?.result as string || '');
        };
        reader.readAsText(selectedFile);
      } else {
        setText('');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !text.trim()) return;
    setIsAnalyzing(true);

    try {
      const content = text || `Content from file: ${file?.name}`;
      const analysisResult = await analyzeDocument(content);
      setResult(analysisResult);
      toast.success('Document analyzed successfully!');
    } catch (error) {
      toast.error('Analysis failed', {
        description: 'Please check your n8n webhook configuration',
      });
    } finally {
      setIsAnalyzing(false);
    }

  const clearFile = () => {
    setFile(null);
    setText('');
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-4xl mx-auto">
        <PageHeader
          title="Document Analyzer"
          description="Upload documents for AI-powered summaries and insights"
        />

        {/* Upload Section */}
        <div className="glass-card p-6 mb-8">
          {!file && !text ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              <FileUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Drop your document here</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
              <button className="btn-secondary">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </button>
            </div>
          ) : file ? (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button onClick={clearFile} className="btn-ghost p-2 text-muted-foreground hover:text-destructive">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : null}

          {/* Or paste text */}
          <div className="mt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">or paste text directly</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setFile(null);
              }}
              placeholder="Paste your document text here..."
              className="input-field min-h-[150px]"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={(!file && !text.trim()) || isAnalyzing}
            className="btn-primary mt-4"
          >
            <Sparkles className={cn('w-4 h-4 mr-2', isAnalyzing && 'animate-spin')} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-primary">{result.wordCount}</p>
                <p className="text-sm text-muted-foreground">Words</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-primary">{result.readingTime}</p>
                <p className="text-sm text-muted-foreground">Reading Time</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className={cn(
                  'text-2xl font-bold capitalize',
                  result.sentiment === 'positive' && 'text-success',
                  result.sentiment === 'neutral' && 'text-warning',
                  result.sentiment === 'negative' && 'text-destructive'
                )}>
                  {result.sentiment}
                </p>
                <p className="text-sm text-muted-foreground">Sentiment</p>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Summary
              </h3>
              <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Key Points & Action Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Key Points
                </h3>
                <ul className="space-y-3">
                  {result.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-primary" />
                  Action Items
                </h3>
                <ul className="space-y-3">
                  {result.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
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
