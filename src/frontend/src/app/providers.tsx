import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Holds the cache for all fetched data. Created once, outside component, so it isn't recreated on every render.
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
        },
    },
});

export function Providers({ children }: { children: ReactNode }){
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}