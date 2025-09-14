import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Rolex",
    description: "Swiss luxury and precision",
    image: "https://images.unsplash.com/photo-1548181048-dab5c1b4a746?w=800&h=600&fit=crop",
    slug: "rolex",
    count: "15+ Models",
  },
  {
    name: "Omega",
    description: "Precision and heritage",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=600&fit=crop",
    slug: "omega",
    count: "12+ Models",
  },
  {
    name: "Tag Heuer",
    description: "Swiss avant-garde",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=600&fit=crop",
    slug: "tag-heuer",
    count: "8+ Models",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-black mb-4">
            Explore Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover timepieces from the world's most prestigious watchmakers, 
            each with their own unique heritage and craftsmanship.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card 
              key={category.slug}
              className="group relative overflow-hidden border-0 bg-black text-white hover:shadow-luxury transition-all duration-500"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="mb-2">
                    <span className="text-gold text-sm font-medium uppercase tracking-wider">
                      {category.count}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-3xl font-bold mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    {category.description}
                  </p>
                  
                  <Button 
                    asChild 
                    size="sm" 
                    className="gold-gradient text-black font-semibold w-fit opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Link href={`/category/${category.slug}`} className="flex items-center gap-2">
                      Explore Collection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <Button asChild size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
            <Link href="/collections">
              View All Brands
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}