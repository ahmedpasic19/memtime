"use client";

import type { Task } from "@/types/memtime";

import { INDENT_PX } from "./TreeNode";

function TaskGlyph() {
  return (
    <span
      className="h-2.5 w-2.5 rounded-full border-2 border-primary/70"
      aria-hidden
    />
  );
}

export function TaskNode({ task, depth }: { task: Task; depth: number }) {
  return (
    <div
      className="flex items-center gap-2 rounded-md py-2 pr-3 text-sm transition-colors hover:bg-accent/40"
      style={{ paddingLeft: depth * INDENT_PX + 36 }}
      role="treeitem"
      aria-selected={false}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <TaskGlyph />
      </span>
      <span className="text-foreground">{task.name}</span>
      <span className="font-mono text-xs text-muted-foreground">#{task.id}</span>
    </div>
  );
}
