import { NextResponse } from "next/server";

type AdvisorRequest = {
  AdvisorID?: string;
  Status?: string;
};

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
      body: JSON.stringify({
        action: "getRequests",
        secret,
      }),
      cache: "no-store",
    });

    const data = await res.json();

    if (data.ok && body.advisorId) {
      const advisorId = String(body.advisorId).trim();

      return NextResponse.json({
        ...data,
        requests: (data.requests || []).filter((request: AdvisorRequest) => {
          const requestAdvisorId = String(request.AdvisorID || "").trim();
          const isAdvisorRequest =
            request.Status === "محول للمرشد الأكاديمي" ||
            request.Status === "تم إبداء رأي المرشد الأكاديمي";

          return requestAdvisorId === advisorId && isAdvisorRequest;
        }),
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
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
      body: JSON.stringify({
        action: "updateDecision",
        secret,
        id: body.id,
        status: body.status,
        headDecision: body.headDecision,
        headNote: body.headNote,
        advisorDecision: body.advisorDecision,
        advisorNote: body.advisorNote,
        advisorName: body.advisorName,
        advisorId: body.advisorId,
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
