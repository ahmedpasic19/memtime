import { NextResponse } from "next/server";

import { getTask } from "@/lib/memtime/tasks";
import { jsonError, parseIntParam } from "@/lib/route-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const taskId = parseIntParam(id, "task id");
    const task = await getTask(taskId, { dataCache: "hierarchy" });
    return NextResponse.json(task);
  } catch (error) {
    return jsonError(error);
  }
}
