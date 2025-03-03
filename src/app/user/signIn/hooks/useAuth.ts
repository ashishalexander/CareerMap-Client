import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { emailSignIn, resetError } from '@/app/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SignInCredentials } from '../Types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state: any) => state.auth);

  const handleEmailSignIn = async (credentials: SignInCredentials) => {
    await dispatch(emailSignIn(credentials));
  };

  // Handle redirect after successful login
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      router.push('/user/Home');
    }
  });

  // Handle error reset
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetError());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return {
    loading,
    error,
    handleEmailSignIn,
  };
};