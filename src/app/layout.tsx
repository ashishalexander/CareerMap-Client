// app/layout.tsx
import React from "react";
import "./globals.css";

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
        {/* You can add a header, footer, or other shared layout elements here */}
        {children}
      </body>
    </html>
  );
}
