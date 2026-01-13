import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  className?: string;
}

export function StatsCard({ icon: Icon, label, value, change, className }: StatsCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              change.type === 'increase' ? 'text-success' : 'text-destructive'
            )}
          >
            {change.type === 'increase' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{change.value}%</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
