import type {Metadata} from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';

const tajawal = Tajawal({ 
  subsets: ['arabic'],
  weight: ["400", "500", "700"],
  variable: '--font-tajawal' 
});

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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
