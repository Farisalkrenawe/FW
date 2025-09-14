import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-display mb-4">Stay in Touch</h2>
            <p className="text-gray-400 mb-8">
              Subscribe to our newsletter and be the first to know about new arrivals, 
              exclusive collections, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button className="gold-gradient text-black font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Crown className="h-8 w-8 text-gold" />
              <span className="text-2xl font-display font-bold">
                LUXURY WATCH
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Curating the world's finest timepieces since 1985. 
              Swiss craftsmanship, exceptional quality, timeless elegance.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-gray-900">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-900">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-900">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-900">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/shop" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All Watches
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/rolex" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Rolex
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/omega" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Omega
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/tag-heuer" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tag Heuer
                </Link>
              </li>
              <li>
                <Link 
                  href="/collections" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link 
                  href="/new-arrivals" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link 
                  href="/size-guide" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link 
                  href="/warranty" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/press" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/accessibility" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Luxury Watch Store. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Secure payments with</span>
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-black">
                  VISA
                </div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-black">
                  MASTERCARD
                </div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-black">
                  AMEX
                </div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-black">
                  PAYPAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}