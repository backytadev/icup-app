import { Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

export const LazyElement = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);
