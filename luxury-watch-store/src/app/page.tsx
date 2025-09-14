"use client";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Watch,
  Shield,
  Award,
  Clock,
  Star,
  ArrowRight,
  Crown,
  Gem,
  Sparkles,
  CheckCircle,
  Timer,
  Globe
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Header } from "@/components/shop/Header";
import { useEffect, useState } from "react";


export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-luxury-gradient overflow-x-hidden">
      <Header />
      
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 rounded-full blur-3xl"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-400/5 to-yellow-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-yellow-500/5 to-amber-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 bg-luxury-card rounded-full px-6 py-3 mb-8 shadow-luxury">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Exclusive Luxury Collection</span>
            </div>

            {/* Main heading with luxury typography */}
            <h1 className="font-luxury text-5xl md:text-8xl lg:text-9xl font-light mb-8 leading-none">
              <span className="block text-foreground">Timeless</span>
              <span className="block text-gold-gradient font-bold">Excellence</span>
            </h1>

            {/* Subtitle */}
            <p className="font-elegant text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover the world's most prestigious timepieces, meticulously curated for connoisseurs who appreciate the finest craftsmanship and heritage.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                href="/products" 
                className="btn-luxury inline-flex items-center gap-3 text-lg px-8 py-4"
              >
                <Sparkles className="w-5 h-5" />
                Explore Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/about" 
                className="btn-luxury-outline inline-flex items-center gap-3 text-lg px-8 py-4"
              >
                <Crown className="w-5 h-5" />
                Our Heritage
              </Link>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full mx-auto mb-2">
            <div className="w-1 h-3 bg-primary rounded-full mx-auto mt-2 animate-bounce"></div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Scroll to explore</p>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl md:text-5xl font-light mb-6">
              Why Choose <span className="text-gold-gradient font-bold">Excellence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience unparalleled luxury service with our commitment to authenticity, expertise, and exceptional customer care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Authenticity Guaranteed",
                description: "Every timepiece undergoes rigorous authentication by certified horologists with decades of expertise.",
                features: ["Swiss Authentication", "Certificate Included", "Lifetime Guarantee"]
              },
              {
                icon: Award,
                title: "Curated Excellence", 
                description: "Handpicked by master watchmakers who understand the artistry and heritage of fine timepieces.",
                features: ["Expert Curation", "Heritage Verified", "Investment Grade"]
              },
              {
                icon: Crown,
                title: "Concierge Service",
                description: "White-glove service including personal consultation, premium packaging, and lifetime support.",
                features: ["Personal Consultant", "Premium Delivery", "24/7 Support"]
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-luxury-card hover-luxury group relative overflow-hidden">
                <CardContent className="p-8">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold group-hover:scale-110 transition-transform duration-500">
                      <feature.icon className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="font-luxury text-2xl font-semibold mb-4 text-center">{feature.title}</h3>
                    <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Preview */}
      <section className="py-20 bg-luxury-dark-grey/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl md:text-5xl font-light mb-6">
              Featured <span className="text-gold-gradient font-bold">Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Exceptional timepieces that define luxury and craftsmanship
            </p>
          </div>

          {/* Collection grid placeholder - will be populated with real products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="bg-luxury-card hover-luxury group overflow-hidden">
                <CardContent className="p-6">
                  <div className="aspect-square mb-6 bg-luxury-medium-grey/20 rounded-lg overflow-hidden relative">
                    <div className="w-full h-full flex items-center justify-center">
                      <Watch className="h-20 w-20 text-primary group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute top-4 right-4 bg-primary text-black text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-luxury text-xl font-semibold mb-2">Premium Collection</h3>
                    <p className="text-muted-foreground text-sm mb-4">Swiss Excellence</p>
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-4">From $25,000</div>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-black transition-colors">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/products" className="btn-luxury inline-flex items-center gap-3 text-lg px-8 py-4">
              <Gem className="w-5 h-5" />
              View Full Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl md:text-5xl font-light mb-6">
              What Our <span className="text-gold-gradient font-bold">Clients Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Alexander Hamilton",
                title: "Watch Collector",
                quote: "The attention to detail and authenticity verification process is unmatched. Truly a luxury experience.",
                rating: 5
              },
              {
                name: "Victoria Sterling", 
                title: "Investment Advisor",
                quote: "I've purchased multiple pieces for my clients. The investment value and service are exceptional.",
                rating: 5
              },
              {
                name: "Robert Chen",
                title: "Entrepreneur", 
                quote: "From consultation to delivery, every step exceeded my expectations. This is luxury redefined.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-luxury-card hover-luxury text-center">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="font-elegant text-lg italic mb-6 text-foreground leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-luxury-black border-t border-luxury-medium-grey py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-luxury text-2xl font-bold mb-6 text-gold-gradient">Luxury Timepieces</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your premier destination for the world's most prestigious watch collections, backed by unparalleled expertise and service.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Authorized Dealer</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-primary">Collections</h4>
              <ul className="space-y-3">
                {["Swiss Luxury", "Investment Grade", "Limited Edition", "Vintage Classics"].map((item) => (
                  <li key={item}>
                    <Link href="/products" className="text-muted-foreground hover-gold transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-primary">Services</h4>
              <ul className="space-y-3">
                {["Authentication", "Valuation", "Consignment", "Maintenance"].map((item) => (
                  <li key={item}>
                    <Link href="/services" className="text-muted-foreground hover-gold transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-primary">Contact</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Timer className="w-4 h-4 text-primary" />
                  <span>Mon-Sat: 9AM-7PM</span>
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>Worldwide Shipping</span>
                </li>
                <li className="flex items-center gap-3">
                  <Crown className="w-4 h-4 text-primary" />
                  <span>Concierge Service</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-luxury-medium-grey pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Luxury Timepieces. All rights reserved. Crafted with excellence since 2024.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}