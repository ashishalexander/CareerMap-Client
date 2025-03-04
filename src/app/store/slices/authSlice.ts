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

// const handleError = (error: unknown) => {
//   if (axios.isAxiosError(error)) {
//     return error.response?.data?.message || 'An error occurred during authentication';
//   }
//   return 'An unexpected error occurred';
// };

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

// Async thunk for Google sign-in
// export const googleSignIn = createAsyncThunk<
//   any,
//   void,
//   { rejectValue: string }
// >(
//   'auth/googleSignIn',
//   async (_, { rejectWithValue }) => {
//     try {
//       const result = await signIn('google', { 
//         redirect: false
//       });

//       if (result?.error) {
//         throw new Error(result.error);
//       }
//       const session = await getSession();
//       console.log("Session after sign in:", session);

//       if (!session?.user) {
//         throw new Error('No session found');
//       }

//       // Save user data to your backend
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/users/Oauth-datasave`,
//         { user:session.user },
//         {withCredentials:true}
//       );  
//       sessionStorage.setItem('accessToken',response.data.accessToken)
//       return response.data;
//     } catch (error) {
//       window.alert(error)
//       return rejectWithValue(handleError(error));
//     }
//   }
// );


export const saveOAuthUserData = createAsyncThunk<
  { accessToken: string; user: any }, // Return type
  any, // Argument type
  { rejectValue: string }
>("auth/saveOAuthUserData", async (userData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/Oauth-datasave`,
      { user: userData }
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
      // .addCase(googleSignIn.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(googleSignIn.fulfilled, (state, action) => {
      //   state.accessToken =action.payload.accessToken;
      //   state.user = action.payload.user;
      //   state.loading = false;
      // })
      // .addCase(googleSignIn.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // });
      // Add these new cases for the OAuth user data save
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
