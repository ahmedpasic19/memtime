import { NextResponse } from "next/server";

import {
  createTimeEntry,
  listTimeEntries,
} from "@/lib/memtime/time-entries";
import { timeEntryInputSchema } from "@/lib/schemas/time-entry";
import { jsonError, parseJsonBody, parseListParams } from "@/lib/route-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entries = await listTimeEntries(parseListParams(searchParams));
    return NextResponse.json(entries);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request, timeEntryInputSchema);
    const entry = await createTimeEntry(body);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
