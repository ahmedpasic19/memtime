import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { TimeEntriesView } from "@/features/time-entries/components/TimeEntriesView";

function TimeEntriesFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function TimeEntriesPage() {
  return (
    <Suspense fallback={<TimeEntriesFallback />}>
      <TimeEntriesView />
    </Suspense>
  );
}
