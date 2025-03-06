// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
// import { signIn, getSession } from 'next-auth/react';
import { Iuser } from '@/const/Iuser';

interface AuthState {
  user: Iuser | null;
  accessToken: string |null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken:null,
  loading: false,
  error: null,
};

// Async thunk for email/password sign-in
export const emailSignIn = createAsyncThunk(
  'auth/emailSignIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signIn`, {
        email,
        password,
      },{withCredentials:true});  
      const {accessToken,user} = response.data.data

      sessionStorage.setItem('accessToken', accessToken);
      return {accessToken,user}
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sign in');
    }
  }
);

export const saveOAuthUserData = createAsyncThunk<
  { accessToken: string; user: any }, // Return type
  any, // Argument type
  { rejectValue: string }
>("auth/saveOAuthUserData", async (userData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/Oauth-datasave`,
      { user: userData },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    // Store the access token
    sessionStorage.setItem("accessToken", response.data.accessToken);

    return {
      accessToken: response.data.accessToken,
      user: response.data.user,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to save OAuth user data"
    );
  }
});



// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError(state){
      state.error=null
    },
    signOut(state) {
      state.user = null;
      state.accessToken=null;
      sessionStorage.removeItem('accessToken')
    },
    updateUserBannerUrl(state,action:PayloadAction<string>){
      if(state.user){ 
        state.user.profile.bannerImage = action.payload
      }
    },
    updateUserProfilePicture: (state, action: PayloadAction<string>) => {
      if (state.user && state.user.profile) {
        state.user.profile.profilePicture = action.payload;
      }
    },
    updateUserProfileInfo: (state, action: PayloadAction<Iuser>)=>{
      if(state.user){
        state.user = action.payload
      }
    },
    updateUserProfileAbout: (state,action:PayloadAction<Iuser>)=>{
      if(state.user){
        state.user = action.payload
      }
    },
    updateUserProfileEducation: (state,action:PayloadAction<Iuser>)=>{
      if(state.user){
        state.user = action.payload
      }
    },
    updateUserProfileExperience:(state,action:PayloadAction<Iuser>)=>{
      if(state.user){
        state.user=action.payload
      }
    },
    updateSubscription:(state,action:PayloadAction<Iuser>)=>{
      if(state.user){
        state.user=action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(emailSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emailSignIn.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(emailSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    .addCase(saveOAuthUserData.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(saveOAuthUserData.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.loading = false;
    })
    .addCase(saveOAuthUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// Export actions and reducer
export const { resetError ,signOut,updateUserBannerUrl,updateUserProfilePicture,updateUserProfileInfo,updateUserProfileAbout,updateUserProfileEducation,updateUserProfileExperience,updateSubscription } = authSlice.actions;
export default authSlice.reducer;
