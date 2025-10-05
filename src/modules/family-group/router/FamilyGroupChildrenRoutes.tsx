/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

//! Lazy load children routes
const LazyFamilyGroupCreatePage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupCreatePage')
);
const LazyFamilyGroupUpdatePage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupUpdatePage')
);
const LazyFamilyGroupInactivatePage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupInactivatePage')
);
const LazyFamilyGroupsSearchPageByTerm = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupsSearchPageByTerm')
);
const LazyFamilyGroupsGeneralSearchPage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupsGeneralSearchPage')
);

export const FamilyGroupChildrenRoutes = [
  {
    path: 'create',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyFamilyGroupCreatePage />
      </Suspense>
    ),
  },
  {
    path: 'general-search',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyFamilyGroupsGeneralSearchPage />
      </Suspense>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyFamilyGroupsSearchPageByTerm />
      </Suspense>
    ),
  },
  {
    path: 'update',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyFamilyGroupUpdatePage />
      </Suspense>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyFamilyGroupInactivatePage />
      </Suspense>
    ),
  },
];
