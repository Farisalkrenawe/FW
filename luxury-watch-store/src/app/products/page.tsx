import { Header } from "@/components/shop/Header";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { 
  Watch, 
  Star, 
  Heart, 
  Eye, 
  Crown,
  Diamond,
  Award,
  Filter,
  Grid,
  List,
  SortAsc
} from "lucide-react";

export default async function ProductsPage() {
  // Get all products
  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE'
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1
      },
      category: true,
      reviews: {
        select: { rating: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-luxury-card rounded-full px-6 py-3 mb-8 shadow-luxury">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Luxury Collection</span>
            </div>
            
            <h1 className="font-luxury text-5xl md:text-6xl font-light mb-6">
              Exceptional <span className="text-gold-gradient font-bold">Timepieces</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our meticulously curated collection of luxury watches from the world's most prestigious manufacturers, each piece a testament to horological excellence.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 p-6 bg-luxury-card rounded-xl shadow-luxury border-luxury">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-medium">{products.length} Masterpieces</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort
              </Button>
              <div className="flex border border-luxury-medium-grey rounded-lg overflow-hidden">
                <Button variant="ghost" size="sm" className="bg-primary/10 text-primary">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => {
                const averageRating = product.reviews.length > 0 
                  ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                  : 5;

                return (
                  <Card key={product.id} className="group cursor-pointer overflow-hidden bg-luxury-card hover-luxury border-luxury shadow-luxury">
                    <div className="relative aspect-square overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].altText || product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Watch className="h-20 w-20 text-primary group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      
                      {/* Luxury overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Quick Action Buttons */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <Button size="icon" className="bg-luxury-card/90 backdrop-blur-sm border-luxury hover:bg-primary hover:text-black shadow-luxury">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Link href={`/product/${product.slug}`}>
                          <Button size="icon" className="bg-luxury-card/90 backdrop-blur-sm border-luxury hover:bg-primary hover:text-black shadow-luxury">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      
                      {/* Premium Badge */}
                      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-gold-gradient text-black text-xs font-bold px-3 py-1 rounded-full shadow-gold">
                          LUXURY
                        </div>
                      </div>
                      
                      {/* Price Badge */}
                      <div className="absolute bottom-4 left-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-luxury-card/95 backdrop-blur-sm rounded-xl px-4 py-2 border-luxury shadow-luxury">
                          <div className="text-primary font-bold text-lg">
                            ${product.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="text-primary text-sm font-medium mb-2 uppercase tracking-wide">
                        {product.brand}
                      </div>
                      
                      <h3 className="font-luxury text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(averageRating)
                                  ? "text-primary fill-current"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground text-sm">
                          ({product.reviews.length})
                        </span>
                        <div className="ml-auto">
                          <Diamond className="w-4 h-4 text-primary" />
                        </div>
                      </div>

                      <Link href={`/product/${product.slug}`} className="block">
                        <Button className="btn-luxury w-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Crown className="w-4 h-4 mr-2" />
                          View Masterpiece
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-luxury-card rounded-full flex items-center justify-center shadow-luxury">
                <Watch className="h-16 w-16 text-primary" />
              </div>
              <h3 className="font-luxury text-3xl font-light text-foreground mb-4">
                Collection <span className="text-gold-gradient font-bold">Coming Soon</span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We're carefully curating exceptional timepieces for our distinguished clientele. 
                Each piece undergoes rigorous authentication and quality assessment.
              </p>
              <div className="mt-8">
                <Link href="/" className="btn-luxury-outline inline-flex items-center gap-3 px-8 py-4">
                  <Crown className="w-5 h-5" />
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}