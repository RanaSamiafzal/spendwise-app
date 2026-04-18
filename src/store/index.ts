import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import transactionsReducer from './slices/transactions-slice';
import subscriptionsReducer from './slices/subscriptions-slice';
import aiReducer from './slices/ai-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    subscriptions: subscriptionsReducer,
    ai: aiReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
