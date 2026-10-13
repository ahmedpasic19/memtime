"use client";

import { useState } from "react";

import { getErrorMessage } from "@/lib/error-messages";
import type { Client } from "@/types/memtime";

import { useProjects } from "../hooks";
import { ProjectNode } from "./ProjectNode";
import { TreeNode } from "./TreeNode";

function ClientGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current" aria-hidden>
      <path d="M6 0 11.2 3v6L6 12 .8 9V3L6 0z" />
    </svg>
  );
}

export function ClientNode({ client, depth = 0 }: { client: Client; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const projectsQuery = useProjects(client.id, expanded);
  const projects = projectsQuery.data?.pages.flat() ?? [];

  const projectCount =
    expanded && !projectsQuery.isLoading ? projects.length : undefined;

  return (
    <TreeNode
      depth={depth}
      glyph={<ClientGlyph />}
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)}
      label={
        <span className="flex w-full items-center justify-between gap-4">
          <span className="font-display font-semibold text-foreground">
            {client.name}
          </span>
          {projectCount !== undefined ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {projectCount} {projectCount === 1 ? "project" : "projects"}
            </span>
          ) : null}
        </span>
      }
      isLoading={expanded && projectsQuery.isLoading}
      isError={expanded && projectsQuery.isError}
      errorMessage={
        projectsQuery.error ? getErrorMessage(projectsQuery.error) : undefined
      }
      isEmpty={
        expanded &&
        !projectsQuery.isLoading &&
        !projectsQuery.isError &&
        projects.length === 0
      }
      emptyMessage="No projects"
      hasChildren
      hasMore={projectsQuery.hasNextPage}
      isLoadingMore={projectsQuery.isFetchingNextPage}
      onLoadMore={() => void projectsQuery.fetchNextPage()}
      loadMoreLabel="Load more projects"
    >
      {projects.map((project) => (
        <ProjectNode key={project.id} project={project} depth={depth + 1} />
      ))}
    </TreeNode>
  );
}
