import api from '../../../lib/axios-config';
import { ResetPasswordResponse } from '../Types/index';

export const resetPassword = async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
  try {
    const response = await api.post<ResetPasswordResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
      token,
      newPassword
    });
    
    return response;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};