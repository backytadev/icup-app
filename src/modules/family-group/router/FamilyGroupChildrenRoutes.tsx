/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyFamilyGroupOptionsPage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupOptionsPage')
);
const LazyFamilyGroupCreatePage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupCreatePage')
);
const LazyFamilyGroupSearchPage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupSearchPage')
);

export const FamilyGroupChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyFamilyGroupOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyFamilyGroupCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyFamilyGroupSearchPage />
      </LazyElement>
    ),
  },
];
