// hooks/useGoogleAuth.ts
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { saveOAuthUserData } from "@/app/store/slices/authSlice";
import { useAppDispatch } from "@/app/store/store";

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Trigger Google OAuth flow through NextAuth
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        throw new Error(result.error);
      }

      // If we have a session with user data
      if (session?.user) {
        // Use the async thunk to save user data and update the state
        const resultAction = await dispatch(saveOAuthUserData(session.user));

        if (saveOAuthUserData.fulfilled.match(resultAction)) {
          // Redirect to home page on success
          router.push("/user/Home");
        } else if (saveOAuthUserData.rejected.match(resultAction)) {
          throw new Error(resultAction.payload as string);
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google");
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleGoogleSignIn,
    loading,
    error,
    session,
  };
};
