"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/shop/product-grid";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SearchBar } from "@/components/shop/search-bar";
import { SortDropdown } from "@/components/shop/sort-dropdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Loader2 } from "lucide-react";
import { CartButton } from "@/components/shop/cart-button";

// Fetch products from API
const fetchProducts = async (searchParams: URLSearchParams) => {
  const response = await fetch(`/api/products?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const mockProducts = [
  {
    id: "1",
    name: "Rolex Submariner Date",
    slug: "rolex-submariner-date",
    price: 8950,
    comparePrice: 9500,
    brand: "Rolex",
    category: "Diving Watches",
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop",
    ],
    inStock: true,
  },
  {
    id: "2",
    name: "Omega Speedmaster Professional",
    slug: "omega-speedmaster-professional",
    price: 6350,
    comparePrice: 6800,
    brand: "Omega",
    category: "Chronographs",
    featured: true,
    rating: 4.8,
    reviewCount: 203,
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop",
    ],
    inStock: true,
  },
  {
    id: "3",
    name: "Patek Philippe Calatrava",
    slug: "patek-philippe-calatrava",
    price: 32400,
    comparePrice: 34500,
    brand: "Patek Philippe",
    category: "Dress Watches",
    featured: true,
    rating: 5.0,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
    ],
    inStock: true,
  },
  {
    id: "4",
    name: "Audemars Piguet Royal Oak",
    slug: "audemars-piguet-royal-oak",
    price: 27400,
    comparePrice: 29200,
    brand: "Audemars Piguet",
    category: "Luxury Sports",
    featured: false,
    rating: 4.9,
    reviewCount: 127,
    images: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400&h=400&fit=crop",
    ],
    inStock: false,
  },
  {
    id: "5",
    name: "Tudor Black Bay 58",
    slug: "tudor-black-bay-58",
    price: 3675,
    comparePrice: 3900,
    brand: "Tudor",
    category: "Sports Watches",
    featured: false,
    rating: 4.7,
    reviewCount: 94,
    images: [
      "https://images.unsplash.com/photo-1495216875107-c6c043ba5d2f?w=400&h=400&fit=crop",
    ],
    inStock: true,
  },
  {
    id: "6",
    name: "Rolex GMT-Master II",
    slug: "rolex-gmt-master-ii",
    price: 12450,
    comparePrice: 13200,
    brand: "Rolex",
    category: "GMT Watches",
    featured: true,
    rating: 4.9,
    reviewCount: 178,
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    ],
    inStock: true,
  },
];

const categories = [
  "All Categories",
  "Diving Watches",
  "Chronographs", 
  "Dress Watches",
  "GMT Watches",
  "Sports Watches",
  "Luxury Sports",
];

const brands = [
  "All Brands",
  "Rolex",
  "Omega", 
  "Patek Philippe",
  "Audemars Piguet",
  "Tudor",
];

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Fix hydration by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load products when search params change
  useEffect(() => {
    const loadProducts = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        setError(null);
        // For now, use mock data - API integration can be added later
        setProducts(mockProducts);
      } catch (err: any) {
        setError(err.message);
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams, mounted]);

  const searchQuery = mounted ? (searchParams.get('search') || '') : '';
  const filteredProducts = searchQuery 
    ? mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockProducts;
  const featuredProducts = filteredProducts.filter(p => p.featured);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Luxury Watch Collection</h1>
              <p className="text-gray-400 mt-2">Discover timepieces that define excellence</p>
            </div>
            <CartButton />
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar />
            </div>
            <div className="flex items-center space-x-4">
              <SortDropdown />
              <div className="flex items-center border border-gray-700 rounded-lg">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-yellow-500 border-r border-gray-700"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-4">
              <FilterSidebar 
                categories={categories}
                brands={brands}
                priceRange={{ min: 0, max: 50000 }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-400">
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : searchQuery ? (
                  `Found ${filteredProducts.length} results for "${searchQuery}"`
                ) : (
                  `Showing ${filteredProducts.length} products`
                )}
              </div>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              </div>
            ) : (
              <>
                {/* Featured Products */}
                {!searchQuery && featuredProducts.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Featured Collection</h2>
                    <ProductGrid 
                      products={featuredProducts} 
                      showAll={false}
                    />
                  </div>
                )}

                {/* All Products */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    {searchQuery ? 'Search Results' : 'All Timepieces'}
                  </h2>
                  {filteredProducts.length > 0 ? (
                    <ProductGrid 
                      products={filteredProducts} 
                      showAll={true}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg">
                        {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                      </div>
                      {searchQuery && (
                        <p className="text-gray-500 mt-2">
                          Try adjusting your search terms or browse all products.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}