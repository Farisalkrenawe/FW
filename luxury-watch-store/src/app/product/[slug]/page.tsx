import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Clock,
  Award,
  Watch
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CartButton } from "@/components/shop/cart-button";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { 
      slug: slug,
      status: 'ACTIVE'
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      inventory: true,
      _count: {
        select: { reviews: true }
      }
    }
  });

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
      id: { not: currentProductId },
      status: 'ACTIVE'
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1
      },
      reviews: {
        select: { rating: true }
      }
    },
    take: 4
  });

  return products.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    comparePrice: product.comparePrice,
    brand: product.brand || 'Unknown',
    images: product.images.map(img => img.url),
    rating: product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0,
    reviewCount: product.reviews.length
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found'
    };
  }

  return {
    title: `${product.name} - ${product.brand || 'Luxury Watch'} | Luxury Watch Store`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const inStock = product.inventory && product.inventory.quantity > 0;
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/shop">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Shop
                </Button>
              </Link>
            </div>
            <CartButton />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText || product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Watch className="h-24 w-24 text-gray-600" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-yellow-500"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-yellow-500 text-sm font-medium">
                  {product.brand}
                </div>
                <Badge variant="outline" className="mt-1 text-gray-400 border-gray-600">
                  {product.category?.name}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400">
                {averageRating.toFixed(1)} ({product._count.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-white">
                  ${product.price.toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.comparePrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.comparePrice && (
                <div className="text-green-500 font-medium">
                  Save ${(product.comparePrice - product.price).toLocaleString()} 
                  ({Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% off)
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-500 font-medium">In Stock</span>
                  {product.inventory && product.inventory.quantity <= 5 && (
                    <span className="text-yellow-500 text-sm">
                      Only {product.inventory.quantity} left!
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-500 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  comparePrice: product.comparePrice,
                  brand: product.brand || 'Unknown',
                  image: primaryImage?.url || '/placeholder-watch.jpg',
                  slug: product.slug,
                  inStock: inStock
                }}
                disabled={!inStock}
              />

              {/* Buy Now Button */}
              <Button
                size="lg"
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                disabled={!inStock}
              >
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">Authenticity</div>
                  <div className="text-xs text-gray-400">100% Guaranteed</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">Free Shipping</div>
                  <div className="text-xs text-gray-400">On orders $1,000+</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">Returns</div>
                  <div className="text-xs text-gray-400">30-day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Description</h3>
            <div className="text-gray-300 prose prose-invert max-w-none">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>

          {product.specifications && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Specifications</h3>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-all duration-300 group">
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <div className="aspect-square bg-gray-800 overflow-hidden">
                      {relatedProduct.images[0] ? (
                        <Image
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Watch className="h-16 w-16 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="text-yellow-500 text-sm font-medium mb-1">
                        {relatedProduct.brand}
                      </div>
                      <h4 className="text-white font-semibold mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                        {relatedProduct.name}
                      </h4>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(relatedProduct.rating)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="text-gray-400 text-sm ml-1">
                          ({relatedProduct.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-lg font-bold">
                          ${relatedProduct.price.toLocaleString()}
                        </span>
                        {relatedProduct.comparePrice && (
                          <span className="text-gray-500 text-sm line-through">
                            ${relatedProduct.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}