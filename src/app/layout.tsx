import type {Metadata} from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'قاعدة بيانات مؤيدي الأستاذ عبدالرحمن اللويزي',
  description: 'البحث عن بيانات المؤيدين والتحقق من التسجيل.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
