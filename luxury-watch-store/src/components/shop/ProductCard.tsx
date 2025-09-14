"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store/cart";

interface ProductCardProps {
  product: Product & {
    averageRating?: number;
    reviewCount?: number;
  };
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const isInStock = product.inventory && product.inventory.quantity > 0;
  const isLowStock = product.inventory && product.inventory.quantity <= product.inventory.lowStockAlert;
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    addItem(product, 1);
  };

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-luxury transition-all duration-300 bg-white border-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-80 aspect-square sm:aspect-[4/3] overflow-hidden">
            {product.featured && (
              <Badge variant="gold" className="absolute top-4 left-4 z-10">
                FEATURED
              </Badge>
            )}
            
            {!isInStock && (
              <Badge variant="destructive" className="absolute top-4 right-4 z-10">
                OUT OF STOCK
              </Badge>
            )}

            {isLowStock && isInStock && (
              <Badge variant="outline" className="absolute top-4 right-4 z-10 bg-orange-100 text-orange-800">
                LOW STOCK
              </Badge>
            )}

            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.brand || product.category?.name}
                </Badge>
              </div>

              <Link 
                href={`/shop/${product.slug}`}
                className="block hover:text-gold transition-colors mb-3"
              >
                <h3 className="font-semibold text-xl mb-2 line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {product.shortDescription || product.description}
              </p>

              {/* Rating */}
              {product.averageRating && product.reviewCount ? (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.averageRating!) 
                            ? 'text-gold fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.averageRating} ({product.reviewCount} reviews)
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-black">
                    {formatPrice(Number(product.price))}
                  </span>
                  {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(Number(product.comparePrice))}
                    </span>
                  )}
                </div>
                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                  <span className="text-sm text-green-600 font-medium">
                    Save {formatPrice(Number(product.comparePrice) - Number(product.price))}
                  </span>
                )}
              </div>

              <Button 
                className="gold-gradient text-black font-semibold"
                disabled={!isInStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="group hover:shadow-luxury transition-all duration-300 bg-white border-0 overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        {product.featured && (
          <Badge variant="gold" className="absolute top-4 left-4 z-10">
            FEATURED
          </Badge>
        )}

        {!isInStock && (
          <Badge variant="destructive" className="absolute top-4 right-4 z-10">
            OUT OF STOCK
          </Badge>
        )}

        {isLowStock && isInStock && (
          <Badge variant="outline" className="absolute top-4 right-4 z-10 bg-orange-100 text-orange-800">
            LOW STOCK
          </Badge>
        )}

        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <Button 
              className="w-full gold-gradient text-black font-semibold"
              size="sm"
              disabled={!isInStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product.brand || product.category?.name}
          </Badge>
        </div>
        
        <Link 
          href={`/shop/${product.slug}`}
          className="block hover:text-gold transition-colors"
        >
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.averageRating && product.reviewCount ? (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(product.averageRating!) 
                      ? 'text-gold fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.averageRating} ({product.reviewCount})
            </span>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-black">
              {formatPrice(Number(product.price))}
            </span>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(Number(product.comparePrice))}
              </span>
            )}
          </div>
        </div>

        {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
          <div className="mt-1">
            <span className="text-sm text-green-600 font-medium">
              Save {formatPrice(Number(product.comparePrice) - Number(product.price))}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}