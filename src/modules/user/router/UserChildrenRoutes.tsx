/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

//! Lazy load children routes
const LazyUsersGeneralSearchPage = lazy(
  () => import('@/modules/user/pages/UsersGeneralSearchPage')
);
const LazyUserCreatePage = lazy(() => import('@/modules/user/pages/UserCreatePage'));
const LazyUserUpdatePage = lazy(() => import('@/modules/user/pages/UserUpdatePage'));
const LazyUserInactivatePage = lazy(() => import('@/modules/user/pages/UserInactivatePage'));
const LazyUsersSearchPageByTerm = lazy(() => import('@/modules/user/pages/UsersSearchPageByTerm'));

export const UserChildrenRoutes = [
  {
    path: 'create',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyUserCreatePage />
      </Suspense>
    ),
  },
  {
    path: 'general-search',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyUsersGeneralSearchPage />
      </Suspense>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyUsersSearchPageByTerm />
      </Suspense>
    ),
  },
  {
    path: 'update',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyUserUpdatePage />
      </Suspense>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyUserInactivatePage />
      </Suspense>
    ),
  },
];
