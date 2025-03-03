"use client"
import React from "react";
import "./globals.css";
import Providers from './components/Provider'
import { SessionProvider } from 'next-auth/react';
import { Toaster } from "sonner"; 


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
          <body >
            <Providers>
            <SessionProvider>
                <Toaster />
                {children}
            </SessionProvider>
            </Providers>
          </body>
      </html>
    
  );
}
