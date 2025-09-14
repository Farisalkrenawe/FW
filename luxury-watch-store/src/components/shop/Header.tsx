"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingBag, 
  User, 
  Heart, 
  Menu,
  Crown,
  Diamond,
  Bell,
  X
} from "lucide-react";
import { useCartStore, useCartStats } from "@/lib/store/cart";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { toggleCart } = useCartStore();
  const { itemCount } = useCartStats();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-luxury-black/95 backdrop-blur-md shadow-luxury border-b border-luxury-medium-grey/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="font-luxury text-2xl font-bold text-gold-gradient hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-8 h-8 text-primary" />
                <span>LUXURY</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-12">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Collection" },
                { href: "/about", label: "Heritage" },
                { href: "/shop", label: "Shop" },
                { href: "/contact", label: "Contact" }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="relative text-sm font-medium text-foreground hover-gold transition-all duration-300 group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Link href="/products">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex hover:bg-primary/10 hover:text-primary transition-all duration-300 relative group"
                >
                  <Search className="h-5 w-5" />
                  <div className="absolute -inset-2 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Button>
              </Link>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => alert('Wishlist feature coming soon!')}
                className="hidden md:flex hover:bg-primary/10 hover:text-primary transition-all duration-300 relative group"
              >
                <Heart className="h-5 w-5" />
                <div className="absolute -inset-2 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => alert('No new notifications')}
                className="hidden md:flex hover:bg-primary/10 hover:text-primary transition-all duration-300 relative group"
              >
                <Bell className="h-5 w-5" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></div>
                <div className="absolute -inset-2 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Button>

              {/* Shopping Cart */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleCart}
                className="relative hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gold-gradient text-black text-xs font-bold flex items-center justify-center shadow-gold animate-pulse">
                    {itemCount}
                  </span>
                )}
                <div className="absolute -inset-2 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Button>

              {/* User Account */}
              {session ? (
                <Button
                  variant="ghost"
                  onClick={() => alert(`Welcome ${session.user?.name}! Profile page coming soon.`)}
                  className="hidden md:flex items-center gap-3 px-4 py-2 bg-luxury-card rounded-full border-luxury hover:bg-luxury-dark-grey transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </Button>
              ) : (
                <Link href="/auth/signin" className="hidden md:block">
                  <Button className="btn-luxury-outline px-6">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden hover:bg-primary/10 hover:text-primary transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-luxury-black/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-20 left-0 right-0 bg-luxury-charcoal border-b border-luxury-medium-grey shadow-luxury">
            <div className="container mx-auto px-4 py-8">
              <nav className="space-y-6">
                {[
                  { href: "/", label: "Home", icon: Crown },
                  { href: "/products", label: "Collection", icon: Diamond },
                  { href: "/about", label: "Heritage", icon: Crown },
                  { href: "/shop", label: "Shop", icon: Diamond },
                  { href: "/contact", label: "Contact", icon: Crown }
                ].map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-luxury-dark-grey transition-colors duration-300 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.label}
                    </span>
                  </Link>
                ))}
                
                {!session && (
                  <div className="pt-6 border-t border-luxury-medium-grey">
                    <Link 
                      href="/auth/signin"
                      className="flex items-center gap-4 px-4 py-3 bg-gold-gradient rounded-lg text-black font-medium hover:scale-105 transition-transform duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
      
      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}