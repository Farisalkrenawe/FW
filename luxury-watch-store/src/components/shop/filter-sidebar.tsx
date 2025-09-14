"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
}

export function FilterSidebar({ categories, brands, priceRange }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState([priceRange.min, priceRange.max]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceFilter([priceRange.min, priceRange.max]);
    setInStockOnly(false);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedBrands.length > 0 || 
    priceFilter[0] > priceRange.min || 
    priceFilter[1] < priceRange.max ||
    inStockOnly;

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">Filters</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {/* Categories */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.slice(1).map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <label 
                htmlFor={`category-${category}`}
                className="text-gray-300 text-sm cursor-pointer hover:text-white"
              >
                {category}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.slice(1).map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => 
                  handleBrandChange(brand, checked as boolean)
                }
              />
              <label 
                htmlFor={`brand-${brand}`}
                className="text-gray-300 text-sm cursor-pointer hover:text-white"
              >
                {brand}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              defaultValue={priceFilter}
              max={priceRange.max}
              min={priceRange.min}
              step={100}
              value={priceFilter}
              onValueChange={setPriceFilter}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              ${priceFilter[0].toLocaleString()}
            </span>
            <span className="text-gray-400">
              ${priceFilter[1].toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stock Availability */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <label 
              htmlFor="in-stock"
              className="text-gray-300 text-sm cursor-pointer hover:text-white"
            >
              In stock only
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}