/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

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
const LazyFamilyGroupOptionsPage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupOptionsPage')
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
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyFamilyGroupsGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyFamilyGroupsSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyFamilyGroupUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyFamilyGroupInactivatePage />
      </LazyElement>
    ),
  },
];
