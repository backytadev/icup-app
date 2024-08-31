import {
  ZoneUpdatePage,
  ZoneCreatePage,
  ZonesSearchPageByTerm,
  ZonesGeneralSearchPage,
  ZoneDeletePage,
} from '@/modules/zone/pages';

export const ZoneChildrenRoutes = [
  {
    path: '/zones/create-zone',
    element: <ZoneCreatePage />,
  },
  {
    path: '/zones/search-zones',
    element: <ZonesGeneralSearchPage />,
  },
  {
    path: '/zones/search-zones-by-term',
    element: <ZonesSearchPageByTerm />,
  },
  {
    path: '/zones/update-zone',
    element: <ZoneUpdatePage />,
  },
  {
    path: '/zones/delete-zone',
    element: <ZoneDeletePage />,
  },
];
