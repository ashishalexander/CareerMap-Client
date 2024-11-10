// profileSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {Iuser} from '../../../const/Iuser'
import api from '../../lib/axios-config'

interface ProfileState {
  profile: Iuser | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunk for fetching profile data
export const fetchUserProfile = createAsyncThunk<
  Iuser,
  string,
  { rejectValue: string }
>(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

// Async thunk for updating profile data
export const updateProfile = createAsyncThunk<
  Iuser,
  Partial<Iuser>,
  { rejectValue: string }
>(
  'profile/updateProfile',
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
