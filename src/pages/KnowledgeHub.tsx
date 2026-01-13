import React, { useState } from 'react';
import { Lightbulb, Bookmark, BookmarkCheck, Clock, Tag, TrendingUp, Brain, Target, Coffee } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'productivity' | 'learning' | 'wellness' | 'career';
  readTime: string;
  tags: string[];
  isSaved: boolean;
}

const knowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: 'The Pomodoro Technique for Deep Work',
    content: 'Work in focused 25-minute intervals followed by 5-minute breaks. After 4 cycles, take a longer 15-30 minute break. This technique helps maintain high concentration and prevents mental fatigue.',
    category: 'productivity',
    readTime: '3 min',
    tags: ['Focus', 'Time Management'],
    isSaved: false,
  },
  {
    id: '2',
    title: 'Active Recall: The Most Effective Learning Method',
    content: 'Instead of passive reading, actively test yourself on the material. Create flashcards, practice problems, or teach concepts to others. This strengthens neural pathways and improves long-term retention.',
    category: 'learning',
    readTime: '4 min',
    tags: ['Memory', 'Study Tips'],
    isSaved: true,
  },
  {
    id: '3',
    title: 'Morning Routines of Successful Developers',
    content: 'Start with code review of yesterday\'s work, tackle the hardest problem first when your mind is fresh, and limit meetings to afternoons. Morning focus time is precious for complex problem-solving.',
    category: 'career',
    readTime: '5 min',
    tags: ['Habits', 'Career Growth'],
    isSaved: false,
  },
  {
    id: '4',
    title: 'The 2-Minute Rule for Building Habits',
    content: 'When starting a new habit, scale it down to something that takes 2 minutes or less. Want to read more? Start by reading one page. This removes resistance and builds consistency.',
    category: 'wellness',
    readTime: '2 min',
    tags: ['Habits', 'Self-Improvement'],
    isSaved: false,
  },
  {
    id: '5',
    title: 'Spaced Repetition for Technical Concepts',
    content: 'Review information at increasing intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month. This optimizes memory retention and is perfect for learning programming languages and frameworks.',
    category: 'learning',
    readTime: '4 min',
    tags: ['Memory', 'Programming'],
    isSaved: false,
  },
  {
    id: '6',
    title: 'Energy Management Over Time Management',
    content: 'Match your tasks to your energy levels. High-energy periods for creative and complex work, low-energy periods for routine tasks. Track your energy patterns for a week to optimize your schedule.',
    category: 'productivity',
    readTime: '3 min',
    tags: ['Energy', 'Productivity'],
    isSaved: true,
  },
];

const categoryIcons = {
  productivity: TrendingUp,
  learning: Brain,
  wellness: Coffee,
  career: Target,
};

const categoryColors = {
  productivity: 'text-primary bg-primary/10',
  learning: 'text-success bg-success/10',
  wellness: 'text-warning bg-warning/10',
  career: 'text-accent bg-accent/10',
};

export default function KnowledgeHub() {
  const [items, setItems] = useState(knowledgeItems);
  const [filter, setFilter] = useState<string>('all');

  const toggleSave = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item
      )
    );
  };

  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : filter === 'saved' ? item.isSaved : item.category === filter
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Knowledge Hub"
          description="Daily productivity tips and AI-generated learning content"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'saved', 'productivity', 'learning', 'wellness', 'career'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium capitalize transition-all',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {f === 'saved' && <BookmarkCheck className="w-4 h-4 inline mr-1" />}
              {f}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const CategoryIcon = categoryIcons[item.category];
            return (
              <div
                key={item.id}
                className="glass-card p-6 hover:shadow-glow transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('p-2 rounded-lg', categoryColors[item.category])}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => toggleSave(item.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {item.isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-primary" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {item.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <span key={tag} className="badge-primary">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.readTime}
                  </span>
                  <span className="capitalize">{item.category}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try a different filter or check back later for new content.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
