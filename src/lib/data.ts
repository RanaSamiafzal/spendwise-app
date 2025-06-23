import type { Account, Budget, Transaction } from './types';

export const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Checking Account', type: 'checking', balance: 4850.75 },
  { id: 'acc2', name: 'Savings Account', type: 'savings', balance: 12300.00 },
  { id: 'acc3', name: 'Credit Card', type: 'debt', balance: -875.20 },
];

export const mockTransactions: Transaction[] = [
  { id: 'txn3', date: '2024-07-18', description: 'Monthly Salary', category: 'Salary', amount: 5000.00, type: 'income' },
  { id: 'txn8', date: '2024-07-05', description: 'Monthly Rent', category: 'Rent', amount: 1500.00, type: 'expense' },
  { id: 'txn7', date: '2024-07-10', description: 'Supermarket', category: 'Groceries', amount: 210.40, type: 'expense' },
  { id: 'txn1', date: '2024-07-20', description: 'Grocery Store', category: 'Groceries', amount: 125.60, type: 'expense' },
  { id: 'txn6', date: '2024-07-12', description: 'Restaurant Dinner', category: 'Entertainment', amount: 80.25, type: 'expense' },
  { id: 'txn2', date: '2024-07-19', description: 'Movie Tickets', category: 'Entertainment', amount: 45.00, type: 'expense' },
  { id: 'txn4', date: '2024-07-17', description: 'Gas Bill', category: 'Utilities', amount: 75.00, type: 'expense' },
  { id: 'txn5', date: '2024-07-15', description: 'Bus Fare', category: 'Transport', amount: 25.50, type: 'expense' },
];

export const mockBudgets: Budget[] = [
  { id: 'bud1', category: 'Groceries', limit: 500 },
  { id: 'bud2', category: 'Entertainment', limit: 200 },
  { id: 'bud3', category: 'Transport', limit: 150 },
  { id: 'bud4', category: 'Utilities', limit: 250 },
  { id: 'bud5', category: 'Rent', limit: 1500 },
];
