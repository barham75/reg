"use client";

import { useEffect, useState } from "react";

type StudentRequest = {
  ID: string;
  Date: string;
  Course: string;
  RequestType: string;
  Reason: string;
  Status: string;
  Section?: string;
  HeadNote?: string;
};

function formatDate(value: string) {
  if (!value) return "غير محدد";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ar-JO");
}

function statusClass(status: string) {
  if (status === "مقبول") return "bg-green-100 text-green-700";
  if (status === "مرفوض") return "bg-red-100 text-red-700";
  if (
    status === "محول للمرشد الأكاديمي" ||
    status === "تم إبداء رأي المرشد الأكاديمي"
  ) {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasStudent, setHasStudent] = useState(false);

  async function fetchMyRequests(studentId: string) {
    try {
      const res = await fetch("/api/my-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
        cache: "no-store",
      });

      const data = await res.json();

      if (data.ok) {
        setRequests((data.requests || []).reverse());
      } else {
        alert("حدث خطأ: " + data.error);
      }
    } catch {
      alert("فشل تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const studentId = localStorage.getItem("studentId") || "";
    const name = localStorage.getItem("studentName") || "";

    setStudentName(name);

    if (!studentId) {
      setHasStudent(false);
      setLoading(false);
      return;
    }

    setHasStudent(true);
    fetchMyRequests(studentId);

    const timer = setInterval(() => {
      fetchMyRequests(studentId);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  if (!hasStudent && !loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
          <h1 className="text-xl font-bold mb-4">يجب تسجيل الدخول أولاً</h1>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold"
          >
            الذهاب إلى صفحة الدخول
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <h1 className="text-2xl font-bold text-center mb-2">
            طلباتي السابقة
          </h1>

          <p className="text-center text-gray-600">
            مرحباً {studentName}
          </p>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold mt-4"
          >
            تسجيل خروج
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-4 text-center shadow">
            جاري تحميل الطلبات...
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl p-4 text-center shadow">
            لا توجد طلبات سابقة
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.ID} className="bg-white rounded-2xl shadow p-4">
                <p><strong>تاريخ الطلب:</strong> {formatDate(req.Date)}</p>
                <p><strong>المساق:</strong> {req.Course}</p>
                <p><strong>نوع الطلب:</strong> {req.RequestType}</p>
                <p><strong>السبب:</strong> {req.Reason}</p>
                <p>
                  <strong>رقم الشعبة:</strong>{" "}
                  {req.Section ? req.Section : "غير محدد"}
                </p>

                <p className="mt-2">
                  <strong>الحالة:</strong>{" "}
                  <span className={`inline-block rounded-lg px-3 py-1 font-bold ${statusClass(req.Status)}`}>
                    {req.Status || "قيد المراجعة"}
                  </span>
                </p>

                {req.HeadNote && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <strong>ملاحظة رئيس القسم:</strong>
                    <p>{req.HeadNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => (window.location.href = "/request")}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold mt-4"
        >
          تقديم طلب جديد
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold mt-3"
        >
          الصفحة الرئيسية
        </button>
      </div>
    </main>
  );
}
