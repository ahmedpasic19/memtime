import { NextResponse } from "next/server";

import { listClientProjects } from "@/lib/memtime/clients";
import { jsonError, parseIntParam, parseListParams } from "@/lib/route-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const clientId = parseIntParam(id, "client id");
    const { searchParams } = new URL(request.url);
    const projects = await listClientProjects(
      clientId,
      parseListParams(searchParams),
    );
    return NextResponse.json(projects);
  } catch (error) {
    return jsonError(error);
  }
}
