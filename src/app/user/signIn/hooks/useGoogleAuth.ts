import { useState, useEffect, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../store/store';
import { saveOAuthUserData } from '../../../store/slices/authSlice';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const prevValues = useRef({ session, status, dispatch, router });


  useEffect(() => {
    console.log("useEffect triggered!");
    console.log("Previous values:", prevValues.current);
    console.log("New values:", { session, status, dispatch, router });
  
    prevValues.current = { session, status, dispatch, router };
    const handleSessionData = async () => {
      // Process the session when it becomes available and we've started a sign-in attempt
      if (session?.user  && status === 'authenticated') {
        try {
          console.log("Processing Google session data:", session.user);
          
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
  }, [session, status,  dispatch, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Trigger Google OAuth flow through NextAuth
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        throw new Error(result.error);
      }
      
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