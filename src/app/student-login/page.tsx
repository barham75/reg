"use client";

import { useState } from "react";

export default function StudentLoginPage() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!studentId || !studentName || !password) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/student-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          studentName,
          password,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("studentId", data.studentId);
        localStorage.setItem("studentName", data.studentName);

        alert(data.message || "تم تسجيل الدخول بنجاح");
        window.location.href = "/major";
      } else {
        alert(data.error || "فشل تسجيل الدخول");
      }
    } catch {
      alert("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  function handleForgotPassword() {
    alert("يرجى مراجعة رئيس القسم أو دائرة القبول والتسجيل لإعادة تعيين كلمة السر.");
  }

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
          دخول الطالب
        </h1>

        <p className="text-center text-gray-600 mb-6">
          أول دخول يحفظ كلمة السر، وبعدها يجب استخدامها للدخول
        </p>

        <label className="block mb-2 font-semibold">رقم الطالب</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="أدخل رقم الطالب"
        />

        <label className="block mb-2 font-semibold">اسم الطالب</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="أدخل اسم الطالب"
        />

        <label className="block mb-2 font-semibold">كلمة السر</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-2"
          placeholder="أدخل كلمة السر"
        />

        {/* زر نسيت كلمة السر */}
        <button
          type="button"
          onClick={handleForgotPassword}
          className="w-full text-blue-700 text-sm mb-4 hover:underline"
        >
          نسيت كلمة السر؟
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold disabled:bg-gray-400"
        >
          {loading ? "جاري التحقق..." : "دخول"}
        </button>
      </form>
    </main>
  );
}