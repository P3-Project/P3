import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

// Every page that loads data has the same three states: loading, error, data.
// This handles the first two once, so pages only write the "data" part:
// <QueryState query={useMenu()}>{(items)} => <List items={items} />}</QueryState>
export function QueryState<T>({
    query,
    children,
    loadingText = "Indlæser...",
    emptyText,
}: {
    query: UseQueryResult<T>;
    children: (data: T) => ReactNode;
    loadingText?: string;
    emptyText?: string;
}) {
    if (query.isPending){
        return <p className="text-muted-foreground">{loadingText}</p>;
    }

    if(query.isError){
        return(
            <div role="alert" className="rounded-lg border border-destructive/40 p-4 text-destructive">
                <p>Noget gik galt: {query.error.message}</p>
                <button className="mt-2 underline" onClick={() => query.refetch()}>Prøv igen</button>
            </div>
        );
    }

    if (emptyText && Array.isArray(query.data) && query.data.length === 0){
        return <p className="text-muted-foreground">{emptyText}</p>
    }

    return <>{children(query.data)}</>;
}