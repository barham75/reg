"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-3">
          نظام طلبات التسجيل
        </h1>

        <p className="text-gray-600 mb-6">
          يرجى اختيار نوع الدخول
        </p>

        <button
          onClick={() => router.push("/student-login")}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold mb-3"
        >
          صفحة الطالب
        </button>

        <button
          onClick={() => router.push("/admin")}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-bold mb-3"
        >
          صفحة رئيس القسم
        </button>

        <button
          onClick={() => router.push("/advisor")}
          className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold"
        >
          صفحة المرشد الأكاديمي
        </button>
      </div>
    </main>
  );
}
