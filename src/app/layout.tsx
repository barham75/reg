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
    <html lang="ar">
      <body>
        {children}

        {/* 👇 هنا تضيف الزر */}
        <BackToGateButton />
      </body>
    </html>
  );
}