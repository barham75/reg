"use client";

import { useEffect, useState } from "react";

export default function StatusPage() {
  const [studentName, setStudentName] = useState("");
  const [date, setDate] = useState("");
  const [course, setCourse] = useState("");
  const [requestType, setRequestType] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("قيد المراجعة");
  const [headNote, setHeadNote] = useState("");
  const [notified, setNotified] = useState(false);

  function formatDate(value: string) {
    if (!value) return "غير محدد";

    const requestDate = new Date(value);

    if (Number.isNaN(requestDate.getTime())) return value;

    return requestDate.toLocaleDateString("ar-JO");
  }

  function statusClass(value: string) {
    if (value === "مقبول") return "bg-green-100 text-green-700";
    if (value === "مرفوض") return "bg-red-100 text-red-700";
    if (
      value === "محول للمرشد الأكاديمي" ||
      value === "تم إبداء رأي المرشد الأكاديمي"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  async function fetchStatus() {
    const requestId = localStorage.getItem("requestId");

    if (!requestId) return;

    const res = await fetch("/api/request-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: requestId }),
    });

    const data = await res.json();

    if (data.ok) {
      const req = data.request;

      setDate(req.Date || "");
      setCourse(req.Course || "");
      setRequestType(req.RequestType || "");
      setReason(req.Reason || "");
      setStatus(req.Status || "قيد المراجعة");
      setHeadNote(req.HeadNote || "");

      if (
        req.Status &&
        req.Status !== "قيد المراجعة" &&
        notified === false
      ) {
        alert("تم تحديث طلبك من قبل رئيس القسم");
        setNotified(true);
      }
    }
  }

  useEffect(() => {
    setStudentName(localStorage.getItem("studentName") || "");

    fetchStatus();

    const timer = setInterval(() => {
      fetchStatus();
    }, 5000);

    return () => clearInterval(timer);
  }, [notified]);

  return (
    <main
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          حالة الطلب
        </h1>

        <p className="text-center text-gray-600 mb-6">
          مرحباً {studentName}
        </p>

        <div className="mb-4">
          <strong>تاريخ الطلب:</strong>
          <p>{formatDate(date)}</p>
        </div>

        <div className="mb-4">
          <strong>المساق:</strong>
          <p>{course}</p>
        </div>

        <div className="mb-4">
          <strong>نوع الطلب:</strong>
          <p>{requestType}</p>
        </div>

        <div className="mb-4">
          <strong>سبب الطلب:</strong>
          <p>{reason}</p>
        </div>

        <div className="mb-4">
          <strong>حالة الطلب:</strong>
          <p className={`inline-block rounded-lg px-3 py-1 font-bold ${statusClass(status)}`}>
            {status}
          </p>
        </div>

        {headNote && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <strong>ملاحظة رئيس القسم:</strong>
            <p>{headNote}</p>
          </div>
        )}
<button
  onClick={() => {
    window.location.href = "/my-requests";
  }}
  className="w-full bg-blue-700 text-white py-3 rounded-lg mb-3"
>
  عرض طلباتي السابقة
</button>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full bg-gray-700 text-white py-3 rounded-lg"
        >
          تسجيل خروج
        </button>
      </div>
    </main>
  );
}
