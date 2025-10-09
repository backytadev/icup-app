/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyUsersGeneralSearchPage = lazy(
  () => import('@/modules/user/pages/UsersGeneralSearchPage')
);
const LazyUserCreatePage = lazy(() => import('@/modules/user/pages/UserCreatePage'));
const LazyUserUpdatePage = lazy(() => import('@/modules/user/pages/UserUpdatePage'));
const LazyUserOptionsPage = lazy(() => import('@/modules/user/pages/UserOptionsPage'));
const LazyUserInactivatePage = lazy(() => import('@/modules/user/pages/UserInactivatePage'));
const LazyUsersSearchPageByTerm = lazy(() => import('@/modules/user/pages/UsersSearchPageByTerm'));

export const UserChildrenRoutes: RouteObject[] = [
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyUserOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyUserCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyUsersGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyUsersSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyUserUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyUserInactivatePage />
      </LazyElement>
    ),
  },
];
