"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminProtectedLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("adminAccessToken");

    if (!accessToken) {
      router.push("/admin/signIn");
    }
  }, [router]);

  return <>{children}</>;
};

export default AdminProtectedLayout;
