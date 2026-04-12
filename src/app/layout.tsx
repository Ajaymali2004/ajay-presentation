import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI22CS43 | Mid-Semester Internship Report – Ajay Mali",
  description: "Mid-Semester Industrial Training Presentation | Ajay Mali | UI22CS43 | IIIT Surat | IDFC FIRST Bank",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
