"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");
  };

  return (
    <section className="py-24 luxury-gradient text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {!isSubscribed ? (
            <>
              <div className="mb-8">
                <Mail className="h-16 w-16 text-gold mx-auto mb-6" />
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  Stay Connected
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Be the first to discover new arrivals, exclusive collections, and 
                  special events. Join our community of watch enthusiasts and collectors.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                  />
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="gold-gradient text-black font-semibold hover:scale-105 transition-transform"
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="group">
                  <div className="text-2xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform">
                    Exclusive
                  </div>
                  <div className="text-sm text-gray-400">
                    Access to limited editions
                  </div>
                </div>
                <div className="group">
                  <div className="text-2xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform">
                    Early Bird
                  </div>
                  <div className="text-sm text-gray-400">
                    First to know about sales
                  </div>
                </div>
                <div className="group">
                  <div className="text-2xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform">
                    Expert Tips
                  </div>
                  <div className="text-sm text-gray-400">
                    Watch care and collecting
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <Check className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Welcome Aboard!
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                Thank you for joining our exclusive community. You'll receive your first 
                newsletter with special offers and new arrivals soon.
              </p>
              <Button 
                onClick={() => setIsSubscribed(false)}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Subscribe Another Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}