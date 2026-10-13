"use client";

import { ChevronRight } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const INDENT_PX = 20;

export interface TreeNodeProps {
  label: React.ReactNode;
  depth?: number;
  glyph?: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  hasChildren?: boolean;
  children?: React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  loadMoreLabel?: string;
}

export function TreeNode({
  label,
  depth = 0,
  glyph,
  expanded,
  onToggle,
  isLoading = false,
  isError = false,
  errorMessage,
  isEmpty = false,
  emptyMessage,
  hasChildren = true,
  children,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  loadMoreLabel = "Load more",
}: TreeNodeProps) {
  const rowClassName = cn(
    "group flex w-full items-center gap-1.5 rounded-lg py-2 pr-3 text-left text-sm font-normal transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    expanded ? "bg-accent/40" : "hover:bg-accent/50",
    hasChildren && "cursor-pointer",
  );

  const rowStyle = { paddingLeft: depth * INDENT_PX + 4 };
  const spineActive = expanded;

  const rowContent = (
    <>
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground"
        aria-hidden
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform duration-200 ease-out",
            expanded && "rotate-90",
          )}
        />
      </span>
      {glyph ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-primary">
          {glyph}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">{label}</div>
    </>
  );

  return (
    <div
      className="select-none"
      role="treeitem"
      aria-selected={false}
      aria-expanded={hasChildren ? expanded : undefined}
    >
      {hasChildren ? (
        <button
          type="button"
          className={rowClassName}
          style={rowStyle}
          onClick={onToggle}
          aria-expanded={expanded}
        >
          {rowContent}
        </button>
      ) : (
        <div className={rowClassName} style={rowStyle}>
          {rowContent}
        </div>
      )}

      {expanded && isLoading && (
        <div style={{ paddingLeft: (depth + 1) * INDENT_PX + 28 }}>
          <Skeleton className="mb-2 h-7 w-48" />
          <Skeleton className="h-7 w-40" />
        </div>
      )}

      {expanded && isError && (
        <div style={{ paddingLeft: (depth + 1) * INDENT_PX + 8 }} className="py-1">
          <Alert variant="destructive">
            <AlertDescription>{errorMessage ?? "Failed to load."}</AlertDescription>
          </Alert>
        </div>
      )}

      {expanded && isEmpty && emptyMessage && (
        <p
          className="py-1 text-xs text-muted-foreground"
          style={{ paddingLeft: (depth + 1) * INDENT_PX + 28 }}
        >
          {emptyMessage}
        </p>
      )}

      {expanded && !isLoading && !isError && !isEmpty && children ? (
        <div
          className={cn(
            "ml-3 border-l-2 pl-2 transition-colors duration-150 motion-reduce:transition-none group-hover:border-primary/35",
            spineActive ? "border-primary/35" : "border-border",
          )}
          style={{ marginLeft: depth * INDENT_PX + 16 }}
          role="group"
        >
          <div className="animate-in fade-in-0 slide-in-from-top-1 duration-200 motion-reduce:animate-none">
            {children}
            {hasMore && onLoadMore ? (
              <div
                className="py-2"
                style={{ paddingLeft: (depth + 1) * INDENT_PX + 8 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isLoadingMore}
                  onClick={onLoadMore}
                >
                  {isLoadingMore ? "Loading…" : loadMoreLabel}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
