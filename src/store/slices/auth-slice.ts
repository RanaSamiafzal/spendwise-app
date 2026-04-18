import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/api-client';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currency: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null
};

export const signup = createAsyncThunk('auth/signup', async (payload: { name: string; email: string; phone: string; password: string }) => {
  return apiRequest<{ token: string; user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
});

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  return apiRequest<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
    },
    hydrateAuth(state, action: { payload: { token: string; user: User } | null }) {
      state.token = action.payload?.token || null;
      state.user = action.payload?.user || null;
    }
  },
  extraReducers: (builder) => {
    for (const thunk of [signup, login]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Authentication failed';
        });
    }
  }
});

export const { logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
