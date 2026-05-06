import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "Missing env variables" },
        { status: 500 }
      );
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        action: "submitRequest",
        secret,
        studentId: body.studentId,
        studentName: body.studentName,
        major: body.major,
        course: body.course,
        courseId: body.courseId || "",
        requestType: body.requestType,
        reason: body.reason,
        section: body.section || "",
        note: body.note || "",
      }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
