import "./globals.css";
import BackToGateButton from "./BackToGateButton";

export const metadata = {
  title: "Registration System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-100">
        <header className="bg-white border-b border-gray-200 py-4 px-4 text-center">
          <img
            src="/jerash.png"
            alt="شعار جامعة جرش"
            className="mx-auto h-20 w-auto sm:h-24"
          />
          <p className="mt-2 text-base font-bold text-gray-800 sm:text-lg">
            كلية العلوم
          </p>
        </header>

        {children}

        {/* 👇 هنا تضيف الزر */}
        <BackToGateButton />
      </body>
    </html>
  );
}
