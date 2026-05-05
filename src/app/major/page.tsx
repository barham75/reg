"use client";

import { useState } from "react";

export default function MajorPage() {
  const [major, setMajor] = useState("");

  const majors = [
    "العلاج الطبيعي",
    "العلوم الطبية المخبرية",
    "الكيمياء",
    "التمريض",
    "الصيدلة",
    "تخصص آخر",
  ];

  function handleNext(e: React.FormEvent) {
    e.preventDefault();

    if (!major) {
      alert("يرجى اختيار التخصص");
      return;
    }

    localStorage.setItem("major", major);
    window.location.href = "/request";
  }

  return (
    <main
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <form
        onSubmit={handleNext}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-3">
          اختيار التخصص
        </h1>

        <p className="text-center text-gray-600 mb-6">
          يرجى اختيار تخصصك للمتابعة
        </p>

        <label className="block mb-2 font-semibold">التخصص</label>

        <select
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6 bg-white"
        >
          <option value="">اختر التخصص</option>
          {majors.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold"
        >
          متابعة
        </button>
      </form>
    </main>
  );
}