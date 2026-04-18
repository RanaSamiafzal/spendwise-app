import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/api-client';
import type { RootState } from '../index';

type State = {
  advice: string;
  chat: { role: 'user' | 'assistant'; text: string }[];
  loading: boolean;
};

const initialState: State = {
  advice: '',
  chat: [],
  loading: false
};

export const fetchAdvice = createAsyncThunk('ai/advice', async (_, { getState }) => {
  const token = (getState() as RootState).auth.token;
  return apiRequest<{ advice: string }>('/ai/advice', { token });
});

export const sendChatMessage = createAsyncThunk('ai/chat', async (message: string, { getState }) => {
  const token = (getState() as RootState).auth.token;
  return apiRequest<{ reply: string }>('/ai/chat', {
    method: 'POST',
    token,
    body: JSON.stringify({ message })
  });
});

const slice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addUserMessage(state, action: { payload: string }) {
      state.chat.push({ role: 'user', text: action.payload });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvice.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdvice.fulfilled, (state, action) => {
        state.loading = false;
        state.advice = action.payload.advice;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.chat.push({ role: 'assistant', text: action.payload.reply });
      });
  }
});

export const { addUserMessage } = slice.actions;
export default slice.reducer;
