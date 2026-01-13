import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  gradient?: boolean;
  badge?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  path,
  gradient = false,
  badge,
  className,
}: FeatureCardProps) {
  return (
    <Link
      to={path}
      className={cn(
        'group feature-card block',
        gradient && 'gradient-border',
        className
      )}
    >
      <div className={cn(gradient && 'gradient-border-inner p-6')}>
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300',
              gradient
                ? 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          {badge && <span className="badge-primary">{badge}</span>}
        </div>

        <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Open</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
