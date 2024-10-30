// app/layout.tsx
import React from "react";
import "./globals.css";
import Providers from './components/Provider'


export const metadata = {
  title: "My App",
  description: "A description of my app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
        {children}

        </Providers>
      </body>
    </html>
  );
}
