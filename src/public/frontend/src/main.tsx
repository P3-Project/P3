import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom';
import { router } from "@/app/router";
import { QueryClient, QueryClientProvider  } from "@tanstack/react-query";
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient(); // Holds the cache for all fetched data

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
