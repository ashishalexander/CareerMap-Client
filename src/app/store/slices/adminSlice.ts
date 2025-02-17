import {createSlice,PayloadAction,createAsyncThunk} from '@reduxjs/toolkit'
import axios from "axios"

interface admin {
    _id:string;
    email:string;
}

interface AdminState{
    isAuthenticated:boolean;
    admin:admin|null;
    isLoading:boolean;
    error:string|null
}

const initialState:AdminState = {
    isAuthenticated:false,
    admin:null,
    isLoading:false,
    error:null
}

export const adminLogin = createAsyncThunk<
  { admin: { _id: string; email: string }; accessToken: string }, // Success payload type
  { email: string; password: string }, // Input payload type
  { rejectValue: string } // Rejected action payload type
>(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/signIn`,
        credentials,
        {
        withCredentials: true,
        headers: { "Content-Type": "application/json" } 
        }
      );
      return response.data; // Assumes response contains `admin` and `accessToken`
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to process login request."
      );
    }
  }
);

// Admin slice definition
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logoutAdmin(state) {
      state.isAuthenticated = false;
      state.admin = null;
      sessionStorage.removeItem("adminAccessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        sessionStorage.setItem("adminAccessToken", action.payload.accessToken);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed. Please try again.";
      });
  },
});

// Export actions and reducer
export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
