import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../store/store';
import { saveOAuthUserData } from '../../../store/slices/authSlice';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // This effect will run when the session changes
  useEffect(() => {
    const handleSessionData = async () => {
      // Only proceed if we have a session and are in a loading state
      // This ensures we only process the session data once
      if (session?.user && loading) {
        try {
          // Use the async thunk to save user data and update the state
          const resultAction = await dispatch(saveOAuthUserData(session.user));

          if (saveOAuthUserData.fulfilled.match(resultAction)) {
            // Redirect to home page on success
            router.push("/user/Home");
          } else if (saveOAuthUserData.rejected.match(resultAction)) {
            throw new Error(resultAction.payload as string);
          }
        } catch (error: any) {
          setError(error.message || "Failed to process Google sign-in data");
          console.error("Google sign-in data processing error:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    handleSessionData();
  }, [session, loading, dispatch, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Trigger Google OAuth flow through NextAuth
      // We don't immediately check the result - we'll let the useEffect above handle the session
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        setLoading(false);
        throw new Error(result.error);
      }
      
      // If we get here without an error, we're waiting for the session to be established
      // The useEffect above will handle the session data when it becomes available
      
    } catch (error: any) {
      setLoading(false);
      setError(error.message || "Failed to sign in with Google");
      console.error("Google sign-in error:", error);
    }
  };

  return {
    handleGoogleSignIn,
    isLoading: loading,
    error,
    isAuthenticated: !!session?.user
  };
};