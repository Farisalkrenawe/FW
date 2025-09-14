"use client";

import { ProductCard } from "./product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  brand: string;
  category: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  inStock: boolean;
}

interface ProductGridProps {
  products: Product[];
  showAll?: boolean;
}

export function ProductGrid({ products, showAll = false }: ProductGridProps) {
  const displayProducts = showAll ? products : products.slice(0, 8);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}