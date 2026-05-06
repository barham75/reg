"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackToPortalButton() {
  const router = useRouter();
  const pathname = usePathname();

  // ❌ لا يظهر في صفحة رئيس القسم
  if (
    pathname === "/" ||
    pathname.includes("/student-login") ||
    pathname.includes("/admin") ||
    pathname.includes("/head") ||
    pathname.includes("/advisor")
  ) {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/requests-gate")}
      style={{
        marginBottom: 16,
        padding: "10px 16px",
        borderRadius: 10,
        border: "none",
        background: "#111827",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      العودة إلى بوابة الطالب
    </button>
  );
}
