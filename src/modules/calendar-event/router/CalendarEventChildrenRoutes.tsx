import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

const LazyEventSearchPage = lazy(() => import('@/modules/calendar-event/pages/CalendarEventSearchPage'));
const LazyEventCreatePage = lazy(() => import('@/modules/calendar-event/pages/CalendarEventCreatePage'));
const LazyEventOptionsPage = lazy(() => import('@/modules/calendar-event/pages/CalendarEventOptionsPage'));

export const CalendarEventChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyEventOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyEventCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyEventSearchPage />
      </LazyElement>
    ),
  },
];
