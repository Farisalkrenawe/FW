"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const featuredProducts = [
  {
    id: 1,
    name: "Rolex Submariner Date",
    brand: "Rolex",
    price: 8950,
    originalPrice: 9500,
    image: "https://images.unsplash.com/photo-1548181048-dab5c1b4a746?w=600&h=600&fit=crop",
    rating: 4.9,
    reviews: 127,
    slug: "rolex-submariner-date",
    isNew: true,
  },
  {
    id: 2,
    name: "Omega Speedmaster Professional",
    brand: "Omega",
    price: 6350,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
    rating: 4.8,
    reviews: 89,
    slug: "omega-speedmaster-professional",
    isNew: false,
  },
  {
    id: 3,
    name: "Tag Heuer Carrera Calibre 16",
    brand: "Tag Heuer",
    price: 2450,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop",
    rating: 4.7,
    reviews: 156,
    slug: "tag-heuer-carrera-calibre-16",
    isNew: false,
  },
  {
    id: 4,
    name: "Rolex GMT-Master II",
    brand: "Rolex",
    price: 10500,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
    rating: 4.9,
    reviews: 203,
    slug: "rolex-gmt-master-ii",
    isNew: true,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-black mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked timepieces that represent the pinnacle of Swiss watchmaking. 
            Each piece is a masterwork of precision and artistry.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-luxury transition-all duration-500 bg-white border-0 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-square overflow-hidden">
                {product.isNew && (
                  <div className="absolute top-4 left-4 z-10 bg-gold text-black px-3 py-1 text-xs font-bold rounded-full">
                    NEW
                  </div>
                )}
                
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
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
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {product.brand}
                  </span>
                </div>
                
                <Link 
                  href={`/shop/${product.slug}`}
                  className="block hover:text-gold transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? 'text-gold fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-black">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
            <Link href="/shop">
              View All Watches
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

