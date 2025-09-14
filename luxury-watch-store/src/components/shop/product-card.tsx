"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Star, ShoppingCart, Watch } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";
import toast from "react-hot-toast";

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, openCart } = useCart();

  const savings = product.comparePrice ? product.comparePrice - product.price : 0;
  const savingsPercent = product.comparePrice 
    ? Math.round((savings / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice,
      brand: product.brand,
      image: product.images[0] || "/placeholder-watch.jpg",
      slug: product.slug,
      sku: product.sku,
      inStock: product.inStock,
    });
    
    // Show success toast
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
    });
    
    // Open cart drawer after adding item
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card 
      className="group bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-800">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Watch className="h-16 w-16 text-gray-600" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.featured && (
                <span className="bg-yellow-600 text-black text-xs font-semibold px-2 py-1 rounded">
                  Featured
                </span>
              )}
              {!product.inStock && (
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
              {savingsPercent > 0 && (
                <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Save {savingsPercent}%
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                isWishlisted 
                  ? "bg-yellow-600 text-black" 
                  : "bg-black/50 text-white hover:bg-yellow-600 hover:text-black"
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>

            {/* Quick Add to Cart - Shows on Hover */}
            {isHovered && product.inStock && (
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Brand */}
          <div className="text-yellow-500 text-sm font-medium mb-1">
            {product.brand}
          </div>

          {/* Product Name */}
          <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-500 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm ml-1">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-bold">
              ${product.price.toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-gray-500 text-sm line-through">
                ${product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="text-gray-400 text-sm mt-1">
            {product.category}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {!product.inStock && (
            <Button disabled className="w-full">
              Out of Stock
            </Button>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}