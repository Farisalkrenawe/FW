"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Michael Chen",
    role: "Watch Collector",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    content: "Exceptional service and authenticity guaranteed. I've purchased three watches from Luxury Watch Store and each experience has been flawless. The attention to detail and customer care is unmatched.",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Business Executive",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3d8?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    content: "The expertise and knowledge of the team is incredible. They helped me find the perfect Rolex for my anniversary. The presentation and packaging made it feel even more special.",
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    content: "Outstanding collection of timepieces and unparalleled customer service. The authentication process and warranty coverage gives me complete confidence in every purchase.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-black mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by watch enthusiasts, collectors, and connoisseurs worldwide. 
            See why our clients choose us for their luxury timepiece investments.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="bg-white border-0 shadow-soft hover:shadow-luxury transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 text-gold fill-current" 
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-8 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-black">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-3xl font-bold text-black mb-2 group-hover:text-gold transition-colors">
              4.9/5
            </div>
            <div className="text-sm text-gray-600">
              Average Rating
            </div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold text-black mb-2 group-hover:text-gold transition-colors">
              50,000+
            </div>
            <div className="text-sm text-gray-600">
              Happy Customers
            </div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold text-black mb-2 group-hover:text-gold transition-colors">
              99.8%
            </div>
            <div className="text-sm text-gray-600">
              Satisfaction Rate
            </div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold text-black mb-2 group-hover:text-gold transition-colors">
              40+
            </div>
            <div className="text-sm text-gray-600">
              Years Experience
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}