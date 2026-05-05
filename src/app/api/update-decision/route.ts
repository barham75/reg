import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.GOOGLE_SCRIPT_SECRET;

  const res = await fetch(scriptUrl!, {
    method: "POST",
    body: JSON.stringify({
      action: "updateDecision",
      secret,
      id: body.id,
      status: body.status,
      headDecision: body.status,
      headNote: body.note,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}