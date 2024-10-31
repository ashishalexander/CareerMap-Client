// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { signIn, getSession } from 'next-auth/react';


// Define the user interface
interface User {
  name: string;
  email: string;
  image: string;
}

// Define the initial state
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'An error occurred during authentication';
  }
  return 'An unexpected error occurred';
};

// Async thunk for email/password sign-in
export const emailSignIn = createAsyncThunk(
  'auth/emailSignIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signIn`, {
        email,
        password,
      });
      return response.data; // Assuming the response contains user data
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sign in');
    }
  }
);

// Async thunk for Google sign-in
export const googleSignIn = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/googleSignIn',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/user/Feed'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      const session = await getSession();
      if (!session?.user) {
        throw new Error('No session found');
      }

      // Save user data to your backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/Oauth-datasave`,
        { user:session.user }
      );

      return response.data.user;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(emailSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emailSignIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(emailSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { signOut } = authSlice.actions;
export default authSlice.reducer;