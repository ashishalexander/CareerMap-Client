import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/sidebar";
import AdminProtectedLayout from "../components/adminProtectedLayout"; // Corrected component name

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AdminProtectedLayout> {/* Corrected component name */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </AdminProtectedLayout> 
  );
};

export default AdminLayout;
