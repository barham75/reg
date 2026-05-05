"use client";

import { useEffect, useState } from "react";

type AdvisorRequest = {
  ID: string;
  StudentID: string;
  StudentName: string;
  Major: string;
  Course: string;
  RequestType: string;
  Reason: string;
  Status: string;
  Section?: string;
  StudentNote?: string;
  AdvisorNote?: string;
  AdvisorID?: string;
  AdvisorName?: string;
};

export default function AdvisorPage() {
  const [requests, setRequests] = useState<AdvisorRequest[]>([]);
  const [opinions, setOpinions] = useState<Record<string, string>>({});
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [advisorId, setAdvisorId] = useState("");
  const [advisorName, setAdvisorName] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchRequests() {
    try {
      setLoading(true);

      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ advisorId }),
        cache: "no-store",
      });

      const data = await res.json();

      if (data.ok) {
        setRequests(data.requests || []);
      } else {
        alert(data.error);
      }
    } catch {
      alert("فشل تحميل طلبات المرشد الأكاديمي");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthorized) return;

    fetchRequests();
  }, [isAuthorized]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!advisorId || !password) {
      alert("يرجى إدخال رقم المرشد وكلمة السر");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/advisor-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          advisorId,
          password,
        }),
        cache: "no-store",
      });

      const data = await res.json();

      if (data.ok) {
        setAdvisorName(data.advisorName || "");
        setIsAuthorized(true);
      } else {
        alert(data.error || "فشل تسجيل دخول المرشد الأكاديمي");
      }
    } catch {
      alert("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  async function submitOpinion(id: string, decision: string, opinion: string) {
    if (!decision) {
      alert("يرجى اختيار موافق أو غير موافق");
      return;
    }

    const advisorNote = opinion.trim()
      ? `${decision} - ${opinion.trim()}`
      : decision;

    try {
      const res = await fetch("/api/advisor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: "تم إبداء رأي المرشد الأكاديمي",
          headDecision: "رأي المرشد الأكاديمي",
          headNote: advisorNote,
          advisorDecision: decision,
          advisorNote,
          advisorId: requests.find((req) => req.ID === id)?.AdvisorID || "",
          advisorName: requests.find((req) => req.ID === id)?.AdvisorName || "",
        }),
      });

      const data = await res.json();

      if (data.ok) {
        alert("تم إرسال رأي المرشد الأكاديمي");
        fetchRequests();
      } else {
        alert(data.error);
      }
    } catch {
      alert("حدث خطأ أثناء إرسال الرأي");
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("يرجى تعبئة حقول تغيير كلمة السر");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("كلمة السر الجديدة غير متطابقة");
      return;
    }

    try {
      const res = await fetch("/api/advisor-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          advisorId,
          currentPassword,
          newPassword,
        }),
        cache: "no-store",
      });

      const data = await res.json();

      if (data.ok) {
        alert("تم تغيير كلمة السر بنجاح");
        setPassword(newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.error || "فشل تغيير كلمة السر");
      }
    } catch {
      alert("حدث خطأ أثناء تغيير كلمة السر");
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        جاري تحميل طلبات المرشد الأكاديمي...
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
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
        >
          <h1 className="text-2xl font-bold text-center mb-3">
            دخول المرشد الأكاديمي
          </h1>

          <p className="text-center text-gray-600 mb-6">
            يرجى إدخال رقم المرشد وكلمة السر
          </p>

          <label className="block mb-2 font-semibold">رقم المرشد</label>
          <input
            type="text"
            value={advisorId}
            onChange={(e) => setAdvisorId(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="أدخل رقم المرشد"
          />

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
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold"
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
        صفحة المرشد الأكاديمي
      </h1>

      <p className="text-center text-gray-600 mb-4">
        مرحباً {advisorName || advisorId}
      </p>

      <form
        onSubmit={changePassword}
        className="max-w-md mx-auto bg-white rounded-xl shadow p-4 mb-4"
      >
        <h2 className="text-lg font-bold mb-3">تغيير كلمة السر</h2>

        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="كلمة السر الحالية"
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="كلمة السر الجديدة"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="تأكيد كلمة السر الجديدة"
        />

        <button
          type="submit"
          className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold"
        >
          حفظ كلمة السر الجديدة
        </button>
      </form>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl p-4 text-center shadow">
          لا توجد طلبات محولة للمرشد الأكاديمي
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.ID} className="bg-white p-4 rounded-xl shadow">
              <p><strong>رقم الطالب:</strong> {req.StudentID}</p>
              <p><strong>الاسم:</strong> {req.StudentName}</p>
              <p><strong>التخصص:</strong> {req.Major}</p>
              <p><strong>المساق:</strong> {req.Course}</p>
              <p><strong>نوع الطلب:</strong> {req.RequestType}</p>
              <p><strong>السبب:</strong> {req.Reason}</p>
              <p>
                <strong>رقم الشعبة:</strong>{" "}
                {req.Section ? req.Section : "غير محدد"}
              </p>
              <p className="mt-2">
                <strong>الحالة:</strong> {req.Status}
              </p>
              <p>
                <strong>المرشد الأكاديمي:</strong>{" "}
                {req.AdvisorName || "غير محدد"}
              </p>
              {req.AdvisorID && (
                <p>
                  <strong>رقم المرشد:</strong> {req.AdvisorID}
                </p>
              )}

              {req.StudentNote && (
                <div className="mt-3 bg-gray-50 border rounded-lg p-3">
                  <strong>ملاحظات الطالب:</strong>
                  <p>{req.StudentNote}</p>
                </div>
              )}

              <label className="block mt-4 mb-2 font-semibold">قرار المرشد</label>
              <select
                value={decisions[req.ID] ?? ""}
                onChange={(e) =>
                  setDecisions((current) => ({
                    ...current,
                    [req.ID]: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-3 bg-white"
              >
                <option value="">اختر القرار</option>
                <option value="موافق">موافق</option>
                <option value="غير موافق">غير موافق</option>
              </select>

              <label className="block mt-4 mb-2 font-semibold">
                رأي المرشد الأكاديمي عند الحاجة
              </label>
              <textarea
                value={opinions[req.ID] ?? ""}
                onChange={(e) =>
                  setOpinions((current) => ({
                    ...current,
                    [req.ID]: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-3"
                rows={3}
                placeholder="اكتب ملاحظتك هنا..."
              />

              <button
                onClick={() =>
                  submitOpinion(
                    req.ID,
                    decisions[req.ID] ?? "",
                    opinions[req.ID] ?? ""
                  )
                }
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold mt-4"
              >
                إرسال الرأي إلى رئيس القسم
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
