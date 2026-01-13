// n8n Webhook Integration Service
// Replace the webhook URLs with your actual n8n webhook endpoints

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  model: 'gemini' | 'deepseek';
  alternativeContent?: string;
  alternativeModel?: 'gemini' | 'deepseek';
}

// Get webhook URL from localStorage settings
const getWebhookUrl = (): string | null => {
  return localStorage.getItem('n8n_webhook_url');
};

// Generic webhook caller
async function callWebhook<T>(endpoint: string, payload: object): Promise<T> {
  const baseUrl = getWebhookUrl();
  
  if (!baseUrl) {
    throw new Error('n8n webhook URL not configured. Please set it in Settings.');
  }

  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook error: ${response.statusText}`);
  }

  return response.json();
}

// AI Chat - Parallel Gemini + DeepSeek with best response selection
export async function sendAIMessage(messages: AIMessage[]): Promise<AIResponse> {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    // Return mock response if webhook not configured
    return mockAIResponse(messages);
  }

  try {
    // Call n8n webhook which handles parallel AI calls
    const response = await callWebhook<{
      primary: { content: string; model: string };
      alternative: { content: string; model: string };
      selectedModel: string;
    }>('ai-chat', { messages });

    return {
      content: response.primary.content,
      model: response.selectedModel as 'gemini' | 'deepseek',
      alternativeContent: response.alternative.content,
      alternativeModel: response.alternative.model as 'gemini' | 'deepseek',
    };
  } catch (error) {
    console.error('AI Chat error:', error);
    return mockAIResponse(messages);
  }
}

// Decision Engine Analysis
export async function analyzeDecision(problem: string): Promise<{
  pros: string[];
  cons: string[];
  risks: string[];
  benefits: string[];
  recommendation: string;
  confidence: number;
}> {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return mockDecisionAnalysis(problem);
  }

  try {
    return await callWebhook('decision-analysis', { problem });
  } catch (error) {
    console.error('Decision analysis error:', error);
    return mockDecisionAnalysis(problem);
  }
}

// Document Analysis
export async function analyzeDocument(content: string): Promise<{
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  wordCount: number;
  readingTime: string;
}> {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return mockDocumentAnalysis(content);
  }

  try {
    return await callWebhook('document-analysis', { content });
  } catch (error) {
    console.error('Document analysis error:', error);
    return mockDocumentAnalysis(content);
  }
}

// Report Analysis
export async function analyzeReport(fileData: string, fileName: string): Promise<{
  overview: string;
  highlights: Array<{ title: string; value: string; trend: string; change: string }>;
  insights: string[];
  recommendations: string[];
  risks: string[];
}> {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return mockReportAnalysis();
  }

  try {
    return await callWebhook('report-analysis', { fileData, fileName });
  } catch (error) {
    console.error('Report analysis error:', error);
    return mockReportAnalysis();
  }
}

// Learning Plan Generation
export async function generateLearningPlan(skill: string): Promise<{
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  roadmap: Array<{
    id: string;
    title: string;
    description: string;
    duration: string;
    resources: string[];
    completed: boolean;
  }>;
  tips: string[];
}> {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return mockLearningPlan(skill);
  }

  try {
    return await callWebhook('learning-plan', { skill });
  } catch (error) {
    console.error('Learning plan error:', error);
    return mockLearningPlan(skill);
  }
}

// CV Optimization
export async function optimizeCV(cvData: object): Promise<{
  optimizedSummary: string;
  skillSuggestions: string[];
  improvementTips: string[];
  atsScore: number;
}> {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return mockCVOptimization();
  }

  try {
    return await callWebhook('cv-optimize', { cvData });
  } catch (error) {
    console.error('CV optimization error:', error);
    return mockCVOptimization();
  }
}

// Mock responses for when webhook is not configured
function mockAIResponse(messages: AIMessage[]): AIResponse {
  const lastMessage = messages[messages.length - 1]?.content || '';
  return {
    content: `This is a simulated response to: "${lastMessage.slice(0, 50)}..."\n\nTo get real AI responses, configure your n8n webhook URL in Settings. Your n8n workflow should:\n\n1. Receive the messages array\n2. Call Gemini and DeepSeek APIs in parallel\n3. Compare responses and select the best one\n4. Return both responses for toggle functionality`,
    model: 'gemini',
    alternativeContent: `Alternative response from DeepSeek:\n\nThis demonstrates the dual-AI comparison feature. In production, both models process your query simultaneously, and the best response is auto-selected based on quality metrics.`,
    alternativeModel: 'deepseek',
  };
}

function mockDecisionAnalysis(problem: string) {
  return {
    pros: [
      'Increased efficiency and productivity',
      'Cost savings in the long term',
      'Better user experience',
      'Competitive advantage in the market',
    ],
    cons: [
      'Initial investment required',
      'Learning curve for the team',
      'Potential integration challenges',
    ],
    risks: [
      'Technology may become outdated',
      'Dependency on third-party services',
    ],
    benefits: [
      'Scalable solution for future growth',
      'Modern architecture enabling faster development',
      'Better maintainability and code quality',
    ],
    recommendation: `Based on the analysis of "${problem.slice(0, 30)}...", proceeding is recommended. Configure your n8n webhook for real AI-powered analysis.`,
    confidence: 85,
  };
}

function mockDocumentAnalysis(content: string) {
  const wordCount = content.split(/\s+/).length || 1247;
  return {
    summary: 'This document discusses strategies for improving software development practices. Configure your n8n webhook in Settings for real AI-powered document analysis.',
    keyPoints: [
      'Code reviews should focus on knowledge sharing',
      'Automated tests provide confidence for changes',
      'CI/CD pipelines reduce deployment friction',
      'Documentation is a first-class citizen',
    ],
    actionItems: [
      'Implement automated testing for critical paths',
      'Set up code review guidelines',
      'Configure CI/CD pipeline',
      'Schedule team retrospectives',
    ],
    sentiment: 'positive' as const,
    wordCount,
    readingTime: `${Math.ceil(wordCount / 200)} min`,
  };
}

function mockReportAnalysis() {
  return {
    overview: 'The report indicates strong performance. Configure your n8n webhook in Settings for real AI-powered report analysis with data extraction.',
    highlights: [
      { title: 'Revenue Growth', value: '$2.4M', trend: 'up', change: '+23%' },
      { title: 'Active Users', value: '145K', trend: 'up', change: '+18%' },
      { title: 'CAC', value: '$42', trend: 'down', change: '-15%' },
      { title: 'Retention Rate', value: '94%', trend: 'up', change: '+5%' },
    ],
    insights: [
      'Mobile traffic increased by 45%',
      'Enterprise segment showing highest growth',
      'Customer lifetime value improved',
    ],
    recommendations: [
      'Increase mobile investment',
      'Expand enterprise sales team',
      'Implement advanced analytics',
    ],
    risks: [
      'Increased competition in SMB segment',
      'Single payment provider dependency',
    ],
  };
}

function mockLearningPlan(skill: string) {
  return {
    skill,
    level: 'beginner' as const,
    estimatedTime: '3-4 months',
    roadmap: [
      {
        id: '1',
        title: 'Foundation & Basics',
        description: 'Learn core concepts, syntax, and fundamental principles',
        duration: '2-3 weeks',
        resources: ['Official Documentation', 'Interactive Tutorials', 'YouTube Courses'],
        completed: false,
      },
      {
        id: '2',
        title: 'Hands-on Practice',
        description: 'Build small projects to reinforce learning',
        duration: '3-4 weeks',
        resources: ['Practice Platforms', 'Code Challenges', 'Mini Projects'],
        completed: false,
      },
      {
        id: '3',
        title: 'Intermediate Concepts',
        description: 'Dive deeper into advanced features and patterns',
        duration: '4-5 weeks',
        resources: ['Advanced Courses', 'Technical Books', 'Community Forums'],
        completed: false,
      },
      {
        id: '4',
        title: 'Real-world Projects',
        description: 'Apply knowledge to production-ready applications',
        duration: '4-6 weeks',
        resources: ['Open Source Contributions', 'Portfolio Projects', 'Freelance Work'],
        completed: false,
      },
    ],
    tips: [
      'Dedicate at least 1-2 hours daily for consistent progress',
      'Build projects while learning, not after',
      'Join communities and engage with other learners',
      'Document your journey and teach others',
      'Review and revise previous topics regularly',
    ],
  };
}

function mockCVOptimization() {
  return {
    optimizedSummary: 'Configure your n8n webhook in Settings for AI-powered CV optimization with Gemini and DeepSeek.',
    skillSuggestions: ['TypeScript', 'Cloud Architecture', 'System Design'],
    improvementTips: [
      'Add quantifiable achievements',
      'Use action verbs to start bullet points',
      'Include relevant keywords for ATS',
    ],
    atsScore: 75,
  };
}
