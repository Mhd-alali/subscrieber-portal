'use client';
import './globals.css';
import Appshell from '@/components/Appshell';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Appshell>
          {children}
        </Appshell>
      </body>
    </html>
  );
}
