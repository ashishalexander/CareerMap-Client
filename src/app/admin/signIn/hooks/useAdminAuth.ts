import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { adminLogin } from "../../../store/slices/adminSlice";
import { AdminSignInFormValues } from "../schema/adminSignIn";

export const useAdminAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.admin);
  const [redirecting, setRedirecting] = useState(false);

  const handleLogin = async (data: AdminSignInFormValues) => {
    try {
      setRedirecting(true);
      await dispatch(adminLogin(data)).unwrap();
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Sign-in error:", error);
      setRedirecting(false);
    }
  };

  return {
    handleLogin,
    isLoading: isLoading || redirecting,
    error,
  };
};