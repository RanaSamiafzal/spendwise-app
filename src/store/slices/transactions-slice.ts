import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/api-client';
import type { RootState } from '../index';

type Transaction = {
  _id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
};

type State = {
  items: Transaction[];
  loading: boolean;
  error: string | null;
};

const initialState: State = { items: [], loading: false, error: null };

export const fetchTransactions = createAsyncThunk('transactions/fetch', async (_, { getState }) => {
  const token = (getState() as RootState).auth.token;
  return apiRequest<{ transactions: Transaction[] }>('/transactions', { token });
});

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (payload: Omit<Transaction, '_id'>, { getState }) => {
    const token = (getState() as RootState).auth.token;
    return apiRequest<{ transaction: Transaction }>('/transactions', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });
  }
);

const slice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.transactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload.transaction);
      });
  }
});

export default slice.reducer;
