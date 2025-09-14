"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useIsInCart } from "@/lib/store/cart";

interface ProductDetailProps {
  product: any; // Full product with all relations
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addItem } = useCartStore();
  const { isInCart, quantity: cartQuantity } = useIsInCart(product.id, selectedVariant);

  const isInStock = product.inventory?.quantity > 0;
  const isLowStock = product.inventory?.quantity <= product.inventory?.lowStockAlert;
  const images = product.images || [];
  const reviews = product.reviews || [];
  const specifications = product.specifications || {};

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.inventory?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    // Reset quantity to 1 after adding
    setQuantity(1);
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-white border">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[selectedImageIndex]?.url}
                  alt={images[selectedImageIndex]?.altText || product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                      onClick={previousImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {product.featured && (
                  <Badge variant="gold" className="absolute top-4 left-4">
                    FEATURED
                  </Badge>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image: any, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-gold shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.brand || product.category?.name}</Badge>
              {!isInStock && (
                <Badge variant="destructive">OUT OF STOCK</Badge>
              )}
              {isLowStock && isInStock && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  LOW STOCK
                </Badge>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-black mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.averageRating) 
                          ? 'text-gold fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating} ({product.totalReviews} reviews)
                </span>
              </div>
            )}

            <p className="text-lg text-gray-700 leading-relaxed">
              {product.shortDescription || product.description}
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-black">
                {formatPrice(Number(product.price))}
              </span>
              {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(Number(product.comparePrice))}
                </span>
              )}
            </div>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Save {formatPrice(Number(product.comparePrice) - Number(product.price))}
                </Badge>
              </div>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Options:</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant: any) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant === variant.id ? "default" : "outline"}
                    onClick={() => setSelectedVariant(variant.id)}
                    className="justify-start"
                  >
                    <div className="text-left">
                      <div className="font-medium">{variant.name}: {variant.value}</div>
                      {variant.price && (
                        <div className="text-sm text-gray-600">
                          +{formatPrice(Number(variant.price))}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.inventory?.quantity || 1)}
                  className="h-10 w-10 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {isInStock && (
                <span className="text-sm text-gray-600">
                  {product.inventory.quantity} available
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="flex-1 gold-gradient text-black font-semibold"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToWishlist}
                className="px-4"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="px-4"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Truck className="h-5 w-5 text-gold" />
              <div className="text-sm">
                <div className="font-medium">Free Shipping</div>
                <div className="text-gray-600">On orders over $1000</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 text-gold" />
              <div className="text-sm">
                <div className="font-medium">Warranty</div>
                <div className="text-gray-600">2 Year International</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <RotateCcw className="h-5 w-5 text-gold" />
              <div className="text-sm">
                <div className="font-medium">Returns</div>
                <div className="text-gray-600">30 Day Policy</div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {Object.keys(specifications).length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-16 prose prose-lg max-w-none">
        <h2 className="font-display text-2xl font-bold mb-6">Description</h2>
        <div className="text-gray-700 leading-relaxed">
          {product.description.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}