"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-pattern">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2187&auto=format&fit=crop"
          alt="Luxury Watch"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Swiss Craftsmanship
            <span className="block text-transparent bg-clip-text gold-gradient">
              Timeless Elegance
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up">
            Discover our exclusive collection of luxury timepieces from the world's 
            most prestigious brands. Each watch tells a story of precision, heritage, 
            and unparalleled craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="gold-gradient text-black font-semibold hover:scale-105 transition-transform">
              <Link href="/shop" className="flex items-center gap-2">
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Watch Story
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-2xl font-bold text-gold mb-2">40+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-2xl font-bold text-gold mb-2">50K+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="text-2xl font-bold text-gold mb-2">1000+</div>
              <div className="text-sm text-gray-400">Luxury Watches</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
          <span className="text-xs mt-2">Scroll</span>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-gold rounded-full animate-float opacity-60"></div>
      <div className="absolute top-1/3 right-16 w-1 h-1 bg-gold rounded-full animate-float opacity-80" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-1/3 left-20 w-1.5 h-1.5 bg-gold rounded-full animate-float opacity-40" style={{ animationDelay: "2s" }}></div>
    </section>
  );
}