import { NextResponse } from "next/server";

import { listProjectTasks } from "@/lib/memtime/projects";
import { jsonError, parseIntParam, parseListParams } from "@/lib/route-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const projectId = parseIntParam(id, "project id");
    const { searchParams } = new URL(request.url);
    const tasks = await listProjectTasks(
      projectId,
      parseListParams(searchParams),
    );
    return NextResponse.json(tasks);
  } catch (error) {
    return jsonError(error);
  }
}
