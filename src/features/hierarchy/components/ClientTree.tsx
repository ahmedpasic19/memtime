"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error-messages";

import { useClients } from "../hooks";
import { ClientNode } from "./ClientNode";

export function ClientTree() {
  const clientsQuery = useClients();
  const clients = clientsQuery.data?.pages.flat() ?? [];

  if (clientsQuery.isLoading) {
    return (
      <div className="space-y-2 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-full max-w-lg" />
      </div>
    );
  }

  if (clientsQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{getErrorMessage(clientsQuery.error)}</AlertDescription>
      </Alert>
    );
  }

  if (clients.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
        No clients found.
      </p>
    );
  }

  return (
    <div
      className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
      role="tree"
      aria-label="Clients, projects, and tasks"
    >
      {clients.map((client) => (
        <ClientNode key={client.id} client={client} />
      ))}
      {clientsQuery.hasNextPage ? (
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={clientsQuery.isFetchingNextPage}
            onClick={() => void clientsQuery.fetchNextPage()}
          >
            {clientsQuery.isFetchingNextPage ? "Loading…" : "Load more clients"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
