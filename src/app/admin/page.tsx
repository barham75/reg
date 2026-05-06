"use client";

import { useEffect, useState } from "react";

type Request = {
  ID: string;
  Date: string;
  StudentID: string;
  StudentName: string;
  Major: string;
  Course: string;
  CourseID?: string;
  IDcourse?: string;
  RequestType: string;
  Reason: string;
  Status: string;
  HeadDecision?: string;
  HeadNote?: string;
  AdvisorDecision?: string;
  AdvisorNote?: string;
  AdvisorID?: string;
  AdvisorName?: string;

  // 🔥 إضافاتنا
  Section?: string;
  StudentNote?: string;
};

type Advisor = {
  ID?: string;
  id?: string;
  AdvisorID?: string;
  Name?: string;
  AdvisorName?: string;
  Major?: string;
  Specialization?: string;
  الاسم?: string;
  التخصص?: string;
};

type AdvisorOption = {
  id: string;
  name: string;
};

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [advisorsByMajor, setAdvisorsByMajor] = useState<Record<string, AdvisorOption[]>>({});
  const [advisorLoadError, setAdvisorLoadError] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [advisorSelections, setAdvisorSelections] = useState<Record<string, string>>({});
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

  async function fetchAdvisors() {
    try {
      const res = await fetch("/api/advisors", {
        method: "POST",
        cache: "no-store",
      });

      const data = await res.json();

      if (!data.ok) {
        setAdvisorLoadError(data.error || "فشل تحميل المرشدين الأكاديميين");
        return;
      }

      const grouped: Record<string, AdvisorOption[]> = {};

      (data.advisors || []).forEach((advisor: Advisor | string) => {
        const id =
          typeof advisor === "string"
            ? advisor
            : advisor.ID || advisor.id || advisor.AdvisorID || advisor.Name || "";
        const name =
          typeof advisor === "string"
            ? advisor
            : advisor.Name || advisor.AdvisorName || advisor.الاسم || "";
        const major =
          typeof advisor === "string"
            ? "تخصص آخر"
            : advisor.Major || advisor.Specialization || advisor.التخصص || "";

        if (!name || !major) return;

        if (!(grouped[major] || []).some((item) => item.id === id)) {
          grouped[major] = [...(grouped[major] || []), { id, name }];
        }
      });

      setAdvisorsByMajor(grouped);
      setAdvisorLoadError("");
    } catch {
      setAdvisorLoadError("فشل تحميل المرشدين الأكاديميين");
    }
  }

  useEffect(() => {
    if (!isAuthorized) {
      setLoading(false);
      return;
    }

    fetchRequests();
    fetchAdvisors();
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
    note: string,
    advisorNote = "",
    advisorName = "",
    advisorId = ""
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
          advisorNote,
          advisorName,
          advisorId,
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
                : req.Status === "محول للمرشد الأكاديمي" ||
                  req.Status === "تم إبداء رأي المرشد الأكاديمي"
                ? "border-blue-500"
                : "border-gray-300"
            }`}
          >
            <p><strong>رقم الطالب:</strong> {req.StudentID}</p>
            <p><strong>الاسم:</strong> {req.StudentName}</p>
            <p><strong>التخصص:</strong> {req.Major}</p>
            <p><strong>المساق:</strong> {req.Course}</p>
            <p>
              <strong>رقم المساق:</strong>{" "}
              {req.CourseID || req.IDcourse || "غير محدد"}
            </p>
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

            {req.AdvisorName && (
              <>
                <p>
                  <strong>المرشد الأكاديمي:</strong> {req.AdvisorName}
                </p>
                {req.AdvisorID && (
                  <p>
                    <strong>رقم المرشد:</strong> {req.AdvisorID}
                  </p>
                )}
              </>
            )}

            {(req.AdvisorNote ||
              (req.Status === "تم إبداء رأي المرشد الأكاديمي"
                ? req.HeadNote
                : "")) && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <strong>رأي المرشد الأكاديمي:</strong>
                <p>
                  {req.AdvisorNote ||
                    (req.Status === "تم إبداء رأي المرشد الأكاديمي"
                      ? req.HeadNote
                      : "")}
                </p>
              </div>
            )}

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

            <label className="block mt-4 mb-2 font-semibold">
              اختيار المرشد الأكاديمي
            </label>
            <select
              value={advisorSelections[req.ID] ?? req.AdvisorID ?? ""}
              onChange={(e) =>
                setAdvisorSelections((current) => ({
                  ...current,
                  [req.ID]: e.target.value,
                }))
              }
              className="w-full border rounded-lg p-3 bg-white"
            >
              <option value="">اختر المرشد الأكاديمي</option>
              {advisorLoadError ? (
                <option value="" disabled>
                  يجب تفعيل قراءة المرشدين من الشيت
                </option>
              ) : (advisorsByMajor[req.Major] || []).length === 0 ? (
                <option value="" disabled>
                  لا يوجد مرشدون لهذا التخصص في الشيت
                </option>
              ) : (
                advisorsByMajor[req.Major].map((advisor) => (
                  <option key={`${req.ID}-${advisor.id}`} value={advisor.id}>
                    {advisor.name}
                  </option>
                ))
              )}
            </select>
            {advisorLoadError && (
              <p className="mt-2 text-sm text-red-600">
                {advisorLoadError}
              </p>
            )}

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

              <button
                onClick={() => {
                  const advisorId =
                    advisorSelections[req.ID] ?? req.AdvisorID ?? "";
                  const advisor = (advisorsByMajor[req.Major] || []).find(
                    (item) => item.id === advisorId
                  );

                  if (!advisor) {
                    alert("يرجى اختيار المرشد الأكاديمي أولاً");
                    return;
                  }

                  updateDecision(
                    req.ID,
                    "محول للمرشد الأكاديمي",
                    "تحويل للمرشد الأكاديمي",
                    notes[req.ID] ?? req.HeadNote ?? "",
                    req.AdvisorNote ?? "",
                    advisor.name,
                    advisor.id
                  );
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                تحويل للمرشد الأكاديمي
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
