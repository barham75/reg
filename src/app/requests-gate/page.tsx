"use client";

import { useRouter } from "next/navigation";

export default function RequestsGatePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">بوابة الطالب</h1>

        <p className="text-gray-600 mb-8">
          الرجاء اختيار أحد الخيارات التالية
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/my-requests")}
            className="w-full bg-blue-700 text-white py-4 rounded-lg font-bold text-lg"
          >
            الدخول إلى الطلبات السابقة
          </button>

          <button
            onClick={() => router.push("/major")}
            className="w-full bg-green-700 text-white py-4 rounded-lg font-bold text-lg"
          >
            تقديم طلب جديد
          </button>
        </div>
      </div>
    </main>
  );
}
