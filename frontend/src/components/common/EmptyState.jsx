import React from 'react';
import { FileX } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ title = 'Nothing here yet', description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center">
      <FileX className="w-7 h-7 text-on-surface-variant/60" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">{description}</p>
      )}
    </div>
    {actionLabel && onAction && (
      <Button variant="primary" size="md" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
