import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Mic,
  MicOff,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  alternativeResponse?: string;
}

const SUGGESTED_PROMPTS = [
  'Explain the concept of microservices architecture',
  'Create a project plan for a mobile app',
  'What are the best practices for API design?',
  'Help me optimize my React application performance',
];

// **Directly put your OpenRouter / OpenAI API key here**
const API_KEY = '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';

// Function to call AI API
async function fetchAIResponse(messages: { role: string; content: string }[]) {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4', // চাইলে পরে change করতে পারো
        messages,
      }),
    });
    const data = await res.json();
    return data.choices[0].message.content || 'No response';
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get AI response');
  }
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlternative, setShowAlternative] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage.content },
      ];

      const content = await fetchAIResponse(apiMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleAlternative = (id: string) => {
    setShowAlternative((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported');
      return;
    }

    if (isListening) return setIsListening(false);

    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + transcript);
      setIsListening(false);
      toast.success('Voice captured', { description: transcript.slice(0, 50) + '...' });
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
        <PageHeader title="AI Personal Assistant" description="Powered by OpenRouter / GPT-4" badge="AI" />

        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse-glow">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">How can I help you today?</h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Ask me anything about development, planning, or analysis.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="p-4 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={cn('flex gap-4 animate-slide-up', message.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn('flex-1 max-w-2xl', message.role === 'user' ? 'text-right' : '')}>
                    <div className={cn('inline-block p-4 rounded-xl', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className="whitespace-pre-wrap text-left">
                        {showAlternative[message.id] && message.alternativeResponse ? message.alternativeResponse : message.content}
                      </p>
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        {message.alternativeResponse && (
                          <button onClick={() => toggleAlternative(message.id)} className="flex items-center gap-1 text-xs text-primary hover:underline">
                            {showAlternative[message.id] ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            {showAlternative[message.id] ? 'Show primary' : 'View alternative'}
                          </button>
                        )}
                        <button onClick={() => handleCopy(message.content, message.id)} className="p-1 hover:bg-muted rounded">
                          {copiedId === message.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4 animate-slide-up">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-4 rounded-xl bg-muted">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex items-end gap-3">
              <button onClick={handleVoiceInput} className={cn('btn-secondary p-3', isListening && 'bg-primary text-primary-foreground')}>
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  className="input-field min-h-[52px] max-h-32 resize-none pr-12"
                  rows={1}
                />
              </div>
              <button onClick={handleSend} disabled={!input.trim() || isLoading} className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">AI responses are generated via OpenRouter API key directly in this page.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
