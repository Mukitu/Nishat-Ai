import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Bot,
  Scale,
  FileText,
  BarChart3,
  GraduationCap,
  Lightbulb,
  FileUser,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  translationKey: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', translationKey: 'dashboard' },
  { icon: User, label: 'Profile', path: '/profile', translationKey: 'profile' },
  { icon: Bot, label: 'AI Assistant', path: '/ai-assistant', translationKey: 'aiAssistant' },
  { icon: Scale, label: 'Decision Engine', path: '/decision-engine', translationKey: 'decisionEngine' },
  { icon: FileText, label: 'Document Analyzer', path: '/document-analyzer', translationKey: 'documentAnalyzer' },
  { icon: BarChart3, label: 'Report Analyzer', path: '/report-analyzer', translationKey: 'reportAnalyzer' },
  { icon: GraduationCap, label: 'Learning Planner', path: '/learning-planner', translationKey: 'learningPlanner' },
  { icon: Lightbulb, label: 'Knowledge Hub', path: '/knowledge-hub', translationKey: 'knowledgeHub' },
  { icon: FileUser, label: 'CV Builder', path: '/cv-builder', translationKey: 'cvBuilder' },
];

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings', path: '/settings', translationKey: 'settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-lg text-sidebar-foreground tracking-tight">NexusAI</h1>
            <p className="text-xs text-muted-foreground">Enterprise Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'nav-item',
                    isActive && 'active',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? t(item.translationKey) : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <span className="truncate animate-fade-in">{t(item.translationKey)}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border py-4 px-2">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'nav-item',
                    isActive && 'active',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? t(item.translationKey) : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <span className="truncate animate-fade-in">{t(item.translationKey)}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'mt-4 w-full nav-item',
            collapsed && 'justify-center px-2'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="animate-fade-in">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
