'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Transaction, Category } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Separator } from '@/components/ui/separator';

interface AddTransactionProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
}

export function AddTransaction({ onAddTransaction, categories, onAddCategory }: AddTransactionProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [open, setOpen] = useState(false);
  const [isAddCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (type === 'income') {
      setCategory('Salary');
    } else {
      setCategory('');
    }
  }, [type]);

  const handleCategoryChange = (value: string) => {
    if (value === 'add_new_category') {
      setAddCategoryDialogOpen(true);
    } else {
      setCategory(value as Category);
    }
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName) {
      if (categories.map(c => c.toLowerCase()).includes(trimmedName.toLowerCase())) {
        toast({
          title: "Category exists",
          description: "This category already exists.",
          variant: "destructive",
        })
      } else {
        onAddCategory(trimmedName);
        setCategory(trimmedName);
        setAddCategoryDialogOpen(false);
        setNewCategoryName("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) {
       toast({
        title: "Missing fields",
        description: "Please fill out all fields to add a transaction.",
        variant: "destructive",
      })
      return
    };

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      category: category as Category,
      type,
    });

    // Reset form and close dialog
    setDescription('');
    setAmount('');
    setCategory('');
    setType('expense');
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <RadioGroup
                  defaultValue="expense"
                  className="col-span-3 flex items-center space-x-4"
                  onValueChange={(value) => setType(value as 'income' | 'expense')}
                  value={type}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="r1" />
                    <Label htmlFor="r1">Expense</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="r2" />
                    <Label htmlFor="r2">Income</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <Select onValueChange={handleCategoryChange} value={category} disabled={type === 'income'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {type === 'income' ? (
                        <SelectItem value="Salary">Salary</SelectItem>
                      ) : (
                        <>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                          <Separator className="my-1" />
                          <SelectItem value="add_new_category">
                            <div className='flex items-center gap-2 text-sm'>
                              <PlusCircle className="h-4 w-4" />
                              <span>Add new category</span>
                            </div>
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add Transaction</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setAddCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a custom category for your expenses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-category-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Coffee"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
