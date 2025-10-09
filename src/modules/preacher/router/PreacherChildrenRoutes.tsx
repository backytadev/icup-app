/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyPreacherInactivatePage = lazy(
  () => import('@/modules/preacher/pages/PreacherInactivatePage')
);
const LazyPreachersSearchPageByTerm = lazy(
  () => import('@/modules/preacher/pages/PreachersSearchPageByTerm')
);
const LazyPreachersGeneralSearchPage = lazy(
  () => import('@/modules/preacher/pages/PreachersGeneralSearchPage')
);
const LazyPreacherUpdatePage = lazy(() => import('@/modules/preacher/pages/PreacherUpdatePage'));
const LazyPreacherCreatePage = lazy(() => import('@/modules/preacher/pages/PreacherCreatePage'));
const LazyPreacherOptionsPage = lazy(() => import('@/modules/preacher/pages/PreacherOptionsPage'));

export const PreacherChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyPreacherOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyPreacherCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyPreachersGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyPreachersSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyPreacherUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyPreacherInactivatePage />
      </LazyElement>
    ),
  },
];
