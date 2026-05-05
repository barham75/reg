import { NextResponse } from "next/server";

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.GOOGLE_SCRIPT_SECRET;

  const res = await fetch(scriptUrl!, {
    method: "POST",
    body: JSON.stringify({
      action: "getRequests",
      secret,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}