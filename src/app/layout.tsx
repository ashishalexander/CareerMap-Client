// app/layout.tsx
import React from "react";
import "./globals.css";
import Providers from './components/Provider'
import { Toaster } from "sonner";
import { SocketProvider } from "./providers";
import { NotificationWrapper } from "./components/NotificationWrapper";
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
          <body >
            <Providers>
              <SocketProvider>
                <NotificationWrapper>
                <Toaster />
                {children}
                </NotificationWrapper>
              
              </SocketProvider>
            </Providers>
          </body>
      </html>
    
  );
}
