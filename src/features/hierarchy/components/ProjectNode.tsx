"use client";

import { useState } from "react";

import { getErrorMessage } from "@/lib/error-messages";
import type { Project } from "@/types/memtime";

import { useTasks } from "../hooks";
import { TaskNode } from "./TaskNode";
import { TreeNode } from "./TreeNode";

function ProjectGlyph() {
  return (
    <span className="h-2.5 w-2.5 rounded-full bg-primary/80" aria-hidden />
  );
}

export function ProjectNode({
  project,
  depth,
}: {
  project: Project;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const tasksQuery = useTasks(project.id, expanded);
  const tasks = tasksQuery.data?.pages.flat() ?? [];

  const taskCount = expanded && !tasksQuery.isLoading ? tasks.length : undefined;

  return (
    <TreeNode
      depth={depth}
      glyph={<ProjectGlyph />}
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)}
      label={
        <span className="flex w-full items-center justify-between gap-4">
          <span>
            <span className="font-medium text-foreground">{project.name}</span>
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              #{project.id}
            </span>
          </span>
          {taskCount !== undefined ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {taskCount} {taskCount === 1 ? "task" : "tasks"}
            </span>
          ) : null}
        </span>
      }
      isLoading={expanded && tasksQuery.isLoading}
      isError={expanded && tasksQuery.isError}
      errorMessage={
        tasksQuery.error ? getErrorMessage(tasksQuery.error) : undefined
      }
      isEmpty={
        expanded &&
        !tasksQuery.isLoading &&
        !tasksQuery.isError &&
        tasks.length === 0
      }
      emptyMessage="No tasks"
      hasChildren
      hasMore={tasksQuery.hasNextPage}
      isLoadingMore={tasksQuery.isFetchingNextPage}
      onLoadMore={() => void tasksQuery.fetchNextPage()}
      loadMoreLabel="Load more tasks"
    >
      {tasks.map((task) => (
        <TaskNode key={task.id} task={task} depth={depth + 1} />
      ))}
    </TreeNode>
  );
}
