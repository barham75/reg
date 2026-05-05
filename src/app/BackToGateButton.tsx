"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BackToGateButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (
    pathname === "/" ||
    pathname === "/requests-gate" ||
    pathname === "/student-login"
  ) {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/requests-gate")}
      className="fixed bottom-5 left-5 z-50 bg-black text-white px-5 py-3 rounded-full shadow-lg font-bold"
    >
      العودة لبوابة الطلبات
    </button>
  );
}