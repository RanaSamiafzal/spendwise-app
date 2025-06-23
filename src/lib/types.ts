export type Category = string;

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: Category;
  amount: number;
  type: 'income' | 'expense';
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'debt';
  balance: number;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
}
