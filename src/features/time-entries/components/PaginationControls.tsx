"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS, type ParsedPagination } from "@/lib/pagination";

interface PaginationControlsProps {
  pagination: ParsedPagination;
  hasNext: boolean;
  isFetching?: boolean;
}

export function PaginationControls({
  pagination,
  hasNext,
  isFetching = false,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasPrev = pagination.offset > 0;

  const navigate = (limit: number, offset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    router.push(`/time-entries?${params.toString()}`);
  };

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {currentPage}
        {isFetching ? " · Loading…" : ""}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={String(pagination.limit)}
          onValueChange={(value) => navigate(Number(value), 0)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasPrev}
          onClick={() =>
            navigate(
              pagination.limit,
              Math.max(0, pagination.offset - pagination.limit),
            )
          }
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() =>
            navigate(pagination.limit, pagination.offset + pagination.limit)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
