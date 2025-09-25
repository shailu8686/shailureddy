import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Safe' | 'Risk';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const baseClasses = 'inline-flex items-center gap-1 rounded-full font-medium';
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';
  
  if (status === 'Safe') {
    return (
      <span className={`${baseClasses} ${sizeClasses} bg-green-100 text-green-800`}>
        <Shield className="w-3 h-3" />
        Safe
      </span>
    );
  }
  
  return (
    <span className={`${baseClasses} ${sizeClasses} bg-red-100 text-red-800`}>
      <AlertTriangle className="w-3 h-3" />
      Risk
    </span>
  );
};
