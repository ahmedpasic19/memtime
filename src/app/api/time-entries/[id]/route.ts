import { NextResponse } from "next/server";

import {
  deleteTimeEntry,
  getTimeEntry,
  updateTimeEntry,
} from "@/lib/memtime/time-entries";
import { timeEntryInputSchema } from "@/lib/schemas/time-entry";
import {
  jsonError,
  parseIntParam,
  parseJsonBody,
} from "@/lib/route-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const entryId = parseIntParam(id, "time entry id");
    const entry = await getTimeEntry(entryId);
    return NextResponse.json(entry);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const entryId = parseIntParam(id, "time entry id");
    const body = await parseJsonBody(request, timeEntryInputSchema);
    const entry = await updateTimeEntry(entryId, body);
    return NextResponse.json(entry);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const entryId = parseIntParam(id, "time entry id");
    const result = await deleteTimeEntry(entryId);
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error);
  }
}
