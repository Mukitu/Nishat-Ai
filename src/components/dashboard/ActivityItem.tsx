import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  type?: 'default' | 'success' | 'warning' | 'primary';
}

export function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  type = 'default',
}: ActivityItemProps) {
  const iconColors = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    primary: 'bg-primary/10 text-primary',
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={cn('flex items-center justify-center w-10 h-10 rounded-lg shrink-0', iconColors[type])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{time}</span>
    </div>
  );
}
