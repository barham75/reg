"use client";

import { useEffect, useState } from "react";

type Request = {
  ID: string;
  Date: string;
  StudentID: string;
  StudentName: string;
  Major: string;
  Course: string;
  RequestType: string;
  Reason: string;
  Status: string;
  HeadDecision?: string;
  HeadNote?: string;

  // 🔥 إضافاتنا
  Section?: string;
  StudentNote?: string;
};

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 جلب الطلبات
  async function fetchRequests() {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
      });

      const data = await res.json();

      if (data.ok) {
        setRequests(data.requests || []);
      } else {
        alert(data.error);
      }
    } catch {
      alert("فشل تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthorized) {
      setLoading(false);
      return;
    }

    fetchRequests();
  }, [isAuthorized]);

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();

    if (password !== "123456") {
      alert("كلمة السر غير صحيحة");
      return;
    }

    setLoading(true);
    setIsAuthorized(true);
  }

  // 🔄 تحديث القرار
  async function updateDecision(
    id: string,
    status: string,
    decision: string,
    note: string
  ) {
    try {
      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
          headDecision: decision,
          headNote: note,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        alert("تم التحديث بنجاح");
        fetchRequests();
      } else {
        alert(data.error);
      }
    } catch {
      alert("حدث خطأ أثناء التحديث");
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        جاري تحميل الطلبات...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <main
        className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
        dir="rtl"
      >
        <form
          onSubmit={handleAdminLogin}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
        >
          <h1 className="text-2xl font-bold text-center mb-3">
            دخول رئيس القسم
          </h1>

          <p className="text-center text-gray-600 mb-6">
            يرجى إدخال كلمة السر للمتابعة
          </p>

          <label className="block mb-2 font-semibold">كلمة السر</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="أدخل كلمة السر"
          />

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-bold"
          >
            دخول
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <h1 className="text-2xl font-bold text-center mb-6">
        لوحة رئيس القسم
      </h1>

      <div className="grid gap-4">
        {requests.map((req) => (
          <div
            key={req.ID}
            className={`bg-white p-4 rounded-xl shadow border-2 ${
              req.Status === "مقبول"
                ? "border-green-500"
                : req.Status === "مرفوض"
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <p><strong>رقم الطالب:</strong> {req.StudentID}</p>
            <p><strong>الاسم:</strong> {req.StudentName}</p>
            <p><strong>التخصص:</strong> {req.Major}</p>
            <p><strong>المساق:</strong> {req.Course}</p>
            <p><strong>نوع الطلب:</strong> {req.RequestType}</p>
            <p><strong>السبب:</strong> {req.Reason}</p>

            {/* 🔥 رقم الشعبة */}
            <p>
              <strong>رقم الشعبة:</strong>{" "}
              {req.Section ? req.Section : "غير محدد"}
            </p>

            {/* 🔥 ملاحظات الطالب */}
            {req.StudentNote && (
              <div className="mt-3 bg-gray-50 border rounded-lg p-3">
                <strong>ملاحظات الطالب:</strong>
                <p>{req.StudentNote}</p>
              </div>
            )}

            <p className="mt-2">
              <strong>الحالة:</strong> {req.Status}
            </p>

            <label className="block mt-4 mb-2 font-semibold">
              رأي رئيس القسم عند الحاجة
            </label>
            <textarea
              value={notes[req.ID] ?? req.HeadNote ?? ""}
              onChange={(e) =>
                setNotes((current) => ({
                  ...current,
                  [req.ID]: e.target.value,
                }))
              }
              className="w-full border rounded-lg p-3"
              rows={3}
              placeholder="اكتب رأيك أو ملاحظتك هنا..."
            />

            {/* أزرار القرار */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  updateDecision(
                    req.ID,
                    "مقبول",
                    "تمت الموافقة",
                    notes[req.ID] ?? req.HeadNote ?? ""
                  )
                }
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                موافقة
              </button>

              <button
                onClick={() =>
                  updateDecision(
                    req.ID,
                    "مرفوض",
                    "تم الرفض",
                    notes[req.ID] ?? req.HeadNote ?? ""
                  )
                }
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                رفض
              </button>

              <button
                onClick={() =>
                  updateDecision(
                    req.ID,
                    "مراجعة رئيس القسم",
                    "مراجعة رئيس القسم",
                    notes[req.ID] ?? req.HeadNote ?? ""
                  )
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                مراجعة رئيس القسم
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
