"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/error-messages";
import {
  useClients,
  useProjects,
  useTask,
  useTasks,
} from "@/features/hierarchy/hooks";

import type { TimeEntryFormValues } from "../schema";

interface TaskPickerProps {
  mode: "create" | "edit";
}

export function TaskPicker({ mode }: TaskPickerProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TimeEntryFormValues>();

  const taskId = watch("taskId");
  const [changeTask, setChangeTask] = useState(mode === "create");
  const [clientId, setClientId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);

  const clientsQuery = useClients();
  const projectsQuery = useProjects(
    clientId,
    changeTask && clientId !== null,
  );
  const tasksQuery = useTasks(projectId, changeTask && projectId !== null);
  const taskQuery = useTask(
    mode === "edit" && !changeTask && taskId !== null ? taskId : null,
  );

  const clients = clientsQuery.data?.pages.flat() ?? [];
  const projects = projectsQuery.data?.pages.flat() ?? [];
  const tasks = tasksQuery.data?.pages.flat() ?? [];

  if (mode === "edit" && !changeTask) {
    const taskLabel = taskQuery.data?.name ?? `Task #${taskId}`;
    return (
      <div className="space-y-2">
        <Label htmlFor="task-display">Task</Label>
        <div className="flex items-center gap-2">
          <p id="task-display" className="text-sm">
            {taskLabel}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setChangeTask(true)}
          >
            Change task
          </Button>
        </div>
        {errors.taskId && (
          <p className="text-sm text-destructive">{errors.taskId.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="client-select">Client</Label>
        <Select
          value={clientId !== null ? String(clientId) : undefined}
          onValueChange={(value) => {
            const id = Number(value);
            setClientId(id);
            setProjectId(null);
            setValue("taskId", null, { shouldValidate: true });
          }}
          disabled={clientsQuery.isLoading}
        >
          <SelectTrigger id="client-select">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={String(client.id)}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {clientsQuery.isError && (
          <p className="text-sm text-destructive">
            {getErrorMessage(clientsQuery.error)}
          </p>
        )}
        {clientsQuery.hasNextPage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={clientsQuery.isFetchingNextPage}
            onClick={() => void clientsQuery.fetchNextPage()}
          >
            {clientsQuery.isFetchingNextPage ? "Loading…" : "Load more clients"}
          </Button>
        )}
      </div>

      {clientId !== null && (
        <div className="space-y-2">
          <Label htmlFor="project-select">Project</Label>
          <Select
            value={projectId !== null ? String(projectId) : undefined}
            onValueChange={(value) => {
              setProjectId(Number(value));
              setValue("taskId", null, { shouldValidate: true });
            }}
            disabled={projectsQuery.isLoading}
          >
            <SelectTrigger id="project-select">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={String(project.id)}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {projectsQuery.isError && (
            <p className="text-sm text-destructive">
              {getErrorMessage(projectsQuery.error)}
            </p>
          )}
          {projectsQuery.hasNextPage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={projectsQuery.isFetchingNextPage}
              onClick={() => void projectsQuery.fetchNextPage()}
            >
              {projectsQuery.isFetchingNextPage
                ? "Loading…"
                : "Load more projects"}
            </Button>
          )}
        </div>
      )}

      {projectId !== null && (
        <div className="space-y-2">
          <Label htmlFor="task-select">Task</Label>
          <Select
            value={taskId !== null ? String(taskId) : undefined}
            onValueChange={(value) => {
              setValue("taskId", Number(value), { shouldValidate: true });
            }}
            disabled={tasksQuery.isLoading}
          >
            <SelectTrigger id="task-select">
              <SelectValue placeholder="Select task" />
            </SelectTrigger>
            <SelectContent>
              {tasks.map((task) => (
                <SelectItem key={task.id} value={String(task.id)}>
                  {task.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tasksQuery.isError && (
            <p className="text-sm text-destructive">
              {getErrorMessage(tasksQuery.error)}
            </p>
          )}
          {tasksQuery.hasNextPage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={tasksQuery.isFetchingNextPage}
              onClick={() => void tasksQuery.fetchNextPage()}
            >
              {tasksQuery.isFetchingNextPage ? "Loading…" : "Load more tasks"}
            </Button>
          )}
        </div>
      )}

      {errors.taskId && (
        <p className="text-sm text-destructive">{errors.taskId.message}</p>
      )}
    </div>
  );
}
