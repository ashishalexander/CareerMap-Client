import api from '../../../lib/axios-config';


export const sendPasswordResetLink = async (email: string): Promise<void> => {
   await api.post('/api/users/forget-password', { email });
};