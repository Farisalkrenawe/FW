"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSortProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function ProductSort({ sortBy, sortOrder, onSortChange }: ProductSortProps) {
  const sortOptions = [
    { value: 'newest-desc', label: 'Newest First', sortBy: 'newest', sortOrder: 'desc' as const },
    { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' as const },
    { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' as const },
    { value: 'name-asc', label: 'Name: A to Z', sortBy: 'name', sortOrder: 'asc' as const },
    { value: 'name-desc', label: 'Name: Z to A', sortBy: 'name', sortOrder: 'desc' as const },
    { value: 'popularity-desc', label: 'Most Popular', sortBy: 'popularity', sortOrder: 'desc' as const },
  ];

  const currentValue = `${sortBy}-${sortOrder}`;

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value);
    if (option) {
      onSortChange(option.sortBy, option.sortOrder);
    }
  };

  return (
    <Select value={currentValue} onValueChange={handleSortChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}