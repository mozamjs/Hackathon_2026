import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
    <Loader2 className="w-7 h-7 animate-spin text-primary" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;
