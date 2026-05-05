"use client";

import { useEffect, useState } from "react";

export default function RequestPage() {
  const [course, setCourse] = useState("");
  const [requestType, setRequestType] = useState("");
  const [reason, setReason] = useState("");
  const [section, setSection] = useState("");
  const [note, setNote] = useState("");

  const [courses, setCourses] = useState<string[]>([]);
  const [requestTypes, setRequestTypes] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  async function fetchOptions() {
    const major = localStorage.getItem("major") || "";

    if (!major) {
      alert("لم يتم تحديد التخصص، يرجى اختيار التخصص أولاً");
      window.location.href = "/major";
      return;
    }

    try {
      const res = await fetch("/api/options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ major }),
        cache: "no-store",
      });

      const data = await res.json();

      if (data.ok) {
        setCourses([...new Set<string>(data.options.courses || [])]);
        setRequestTypes([...new Set<string>(data.options.requestTypes || [])]);
        setReasons([...new Set<string>(data.options.reasons || [])]);
      } else {
        alert("فشل تحميل الخيارات: " + data.error);
      }
    } catch (err) {
      alert("فشل تحميل الخيارات: " + String(err));
    } finally {
      setLoadingOptions(false);
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!course || !requestType || !reason) {
      alert("يرجى تعبئة الحقول المطلوبة");
      return;
    }

    const studentId = localStorage.getItem("studentId") || "";
    const studentName = localStorage.getItem("studentName") || "";
    const major = localStorage.getItem("major") || "";

    if (!studentId || !studentName || !major) {
      alert("بيانات الطالب غير مكتملة، يرجى تسجيل الدخول من جديد");
      window.location.href = "/";
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          studentId,
          studentName,
          major,
          course,
          requestType,
          reason,
          section,
          note,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("requestId", data.id);
        localStorage.setItem("course", course);
        localStorage.setItem("requestType", requestType);
        localStorage.setItem("reason", reason);
        localStorage.setItem("section", section);
        localStorage.setItem("note", note);
        localStorage.setItem("status", "قيد المراجعة");

        alert("تم حفظ الطلب بنجاح");

        // ✅ التعديل الوحيد هنا
        window.location.href = "/requests-gate";
      } else {
        alert("لم يتم حفظ الطلب: " + data.error);
      }
    } catch (err) {
      alert("حدث خطأ أثناء حفظ الطلب: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <form
        className="bg-white p-6 rounded-xl w-full max-w-md shadow"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          تقديم طلب
        </h2>

        {loadingOptions ? (
          <p className="text-center">جاري التحميل...</p>
        ) : (
          <>
            <label className="block mb-2">المساق</label>
            <select
              className="w-full p-2 border mb-4 rounded"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">اختر المساق</option>
              {courses.map((c, i) => (
                <option key={`course-${i}-${c}`} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="block mb-2">نوع الإجراء</label>
            <select
              className="w-full p-2 border mb-4 rounded"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option value="">اختر نوع الإجراء</option>
              {requestTypes.map((t, i) => (
                <option key={`request-${i}-${t}`} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <label className="block mb-2">السبب</label>
            <select
              className="w-full p-2 border mb-4 rounded"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">اختر السبب</option>
              {reasons.map((r, i) => (
                <option key={`reason-${i}-${r}`} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <label className="block mb-2">رقم الشعبة</label>
            <select
              className="w-full p-2 border mb-4 rounded"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="">اختر الشعبة</option>
              {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((n) => (
                <option key={`section-${n}`} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <label className="block mb-2">ملاحظات الطالب (اختياري)</label>
            <textarea
              className="w-full p-2 border mb-4 rounded"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب ملاحظتك هنا..."
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
            >
              {loading ? "جاري الإرسال..." : "إرسال الطلب"}
            </button>
          </>
        )}
      </form>
    </main>
  );
}