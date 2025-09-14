"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { ProductFilters } from "@/types";

interface FilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({
    min: filters.priceMin?.toString() || '',
    max: filters.priceMax?.toString() || ''
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      // This would ideally be a separate API endpoint for brands
      // For now, we'll use some common luxury watch brands
      setBrands(['Rolex', 'Omega', 'Tag Heuer', 'Cartier', 'Breitling', 'IWC', 'Patek Philippe']);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    onFilterChange({
      category: filters.category === categorySlug ? undefined : categorySlug
    });
  };

  const handleBrandToggle = (brand: string) => {
    const currentBrands = filters.brand || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    onFilterChange({
      brand: newBrands.length > 0 ? newBrands : undefined
    });
  };

  const handlePriceChange = () => {
    onFilterChange({
      priceMin: priceRange.min ? parseFloat(priceRange.min) : undefined,
      priceMax: priceRange.max ? parseFloat(priceRange.max) : undefined
    });
  };

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange({
      category: undefined,
      brand: undefined,
      priceMin: undefined,
      priceMax: undefined,
      inStock: undefined,
      featured: undefined
    });
  };

  const hasActiveFilters = filters.category || 
                          (filters.brand && filters.brand.length > 0) || 
                          filters.priceMin || 
                          filters.priceMax || 
                          filters.inStock || 
                          filters.featured;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filters.category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleCategoryChange(filters.category!)}
                />
              </Badge>
            )}
            {filters.brand?.map(brand => (
              <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                {brand}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleBrandToggle(brand)}
                />
              </Badge>
            ))}
            {filters.priceMin && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min: ${filters.priceMin}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    setPriceRange(prev => ({ ...prev, min: '' }));
                    onFilterChange({ priceMin: undefined });
                  }}
                />
              </Badge>
            )}
            {filters.priceMax && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max: ${filters.priceMax}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    setPriceRange(prev => ({ ...prev, max: '' }));
                    onFilterChange({ priceMax: undefined });
                  }}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span className="text-sm">
                {category.name} ({category._count?.products || 0})
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brand?.includes(brand) || false}
                onChange={() => handleBrandToggle(brand)}
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Min Price</label>
              <Input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Max Price</label>
              <Input
                type="number"
                placeholder="50000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePriceChange}
            className="w-full"
          >
            Apply Price Filter
          </Button>
          
          {/* Quick price ranges */}
          <div className="space-y-1">
            <p className="text-xs text-gray-600">Quick ranges:</p>
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: 'Under $5K', min: 0, max: 5000 },
                { label: '$5K - $10K', min: 5000, max: 10000 },
                { label: '$10K - $20K', min: 10000, max: 20000 },
                { label: 'Over $20K', min: 20000, max: null }
              ].map(range => (
                <Button
                  key={range.label}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 justify-start"
                  onClick={() => {
                    onFilterChange({
                      priceMin: range.min,
                      priceMax: range.max || undefined
                    });
                    setPriceRange({
                      min: range.min.toString(),
                      max: range.max?.toString() || ''
                    });
                  }}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => onFilterChange({ inStock: e.target.checked || undefined })}
              className="rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span className="text-sm">In Stock Only</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.featured || false}
              onChange={(e) => onFilterChange({ featured: e.target.checked || undefined })}
              className="rounded border-gray-300 text-gold focus:ring-gold"
            />
            <span className="text-sm">Featured Products</span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}