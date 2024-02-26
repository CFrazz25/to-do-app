import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import 'rsuite/dist/rsuite-no-reset.min.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}