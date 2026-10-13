import { NextResponse } from "next/server";

import { listClients } from "@/lib/memtime/clients";
import { jsonError, parseListParams } from "@/lib/route-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clients = await listClients(parseListParams(searchParams));
    return NextResponse.json(clients);
  } catch (error) {
    return jsonError(error);
  }
}
