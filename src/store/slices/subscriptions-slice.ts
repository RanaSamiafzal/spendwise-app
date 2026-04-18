import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/api-client';
import type { RootState } from '../index';

type Subscription = {
  _id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  category: string;
  status: 'active' | 'paused' | 'cancelled';
};

type State = {
  items: Subscription[];
  monthlyBurn: number;
  loading: boolean;
};

const initialState: State = {
  items: [],
  monthlyBurn: 0,
  loading: false
};

export const fetchSubscriptions = createAsyncThunk('subscriptions/fetch', async (_, { getState }) => {
  const token = (getState() as RootState).auth.token;
  return apiRequest<{ subscriptions: Subscription[] }>('/subscriptions', { token });
});

export const fetchSubscriptionInsights = createAsyncThunk('subscriptions/insights', async (_, { getState }) => {
  const token = (getState() as RootState).auth.token;
  return apiRequest<{ monthlyBurn: number }>('/subscriptions/insights', { token });
});

export const createSubscription = createAsyncThunk(
  'subscriptions/create',
  async (payload: Omit<Subscription, '_id'>, { getState }) => {
    const token = (getState() as RootState).auth.token;
    return apiRequest<{ subscription: Subscription }>('/subscriptions', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });
  }
);

const slice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.items = action.payload.subscriptions;
        state.loading = false;
      })
      .addCase(fetchSubscriptionInsights.fulfilled, (state, action) => {
        state.monthlyBurn = action.payload.monthlyBurn;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.items.push(action.payload.subscription);
      });
  }
});

export default slice.reducer;
