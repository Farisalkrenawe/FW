"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  defaultValue?: string;
}

export function SearchBar({ onSearch, defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue || searchParams.get('search') || "");
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Custom debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        
        if (searchQuery) {
          params.set('search', searchQuery);
        } else {
          params.delete('search');
        }
        
        // Reset to first page when searching
        params.delete('page');
        
        const newUrl = `/shop${params.toString() ? '?' + params.toString() : ''}`;
        router.push(newUrl);
        
        if (onSearch) {
          onSearch(searchQuery);
        }
      }, 300);
    },
    [router, searchParams, onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleClear = () => {
    setQuery("");
    debouncedSearch("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(query);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={query}
        onChange={handleInputChange}
        placeholder="Search luxury watches..."
        className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-yellow-500"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}