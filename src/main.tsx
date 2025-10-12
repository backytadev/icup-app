/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import './index.css';
import { router } from './router/router';
import { AppInitializer } from './AppInitializer';

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppInitializer>
      <QueryClientProvider client={client}>
        <ReactQueryDevtools />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppInitializer>
  </React.StrictMode>
);
