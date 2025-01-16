import React from "react";
import Header from "../../components/header/Header";
import ProtectedLayout from "@/app/components/protectedLayout";
import { SocketProvider } from "./providers";
import { NotificationWrapper } from "@/app/components/NotificationWrapper";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <ProtectedLayout>
      <SocketProvider>
        <NotificationWrapper>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </NotificationWrapper>
      </SocketProvider>
    </ProtectedLayout>
  );
};

export default UserLayout;
