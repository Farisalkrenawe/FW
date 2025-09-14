"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Minus, 
  Plus, 
  Trash2, 
  Truck, 
  ArrowRight, 
  ShoppingBag,
  Shield,
  Award,
  Crown,
  Lock,
  CheckCircle,
  Gift,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/shop/Header';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotals, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const { subtotal, tax, shipping, total } = getTotals();

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-gradient">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Empty cart illustration */}
              <div className="w-32 h-32 mx-auto mb-8 bg-luxury-card rounded-full flex items-center justify-center shadow-luxury">
                <ShoppingBag className="w-16 h-16 text-primary" />
              </div>
              
              <h1 className="font-luxury text-4xl md:text-5xl font-light mb-6">
                Your Collection <span className="text-gold-gradient font-bold">Awaits</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Discover extraordinary timepieces that define luxury and craftsmanship.
              </p>
              
              <Link href="/products" className="btn-luxury inline-flex items-center gap-3 text-lg px-8 py-4">
                <Sparkles className="w-5 h-5" />
                Explore Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="font-luxury text-4xl md:text-5xl font-light text-center mb-4">
              Your <span className="text-gold-gradient font-bold">Collection</span>
            </h1>
            <p className="text-center text-muted-foreground text-lg">
              {items.length} exquisite {items.length === 1 ? 'timepiece' : 'timepieces'} selected
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Cart Items */}
            <div className="xl:col-span-2">
              <Card className="bg-luxury-card shadow-luxury border-luxury">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {items.map((item, index) => (
                      <div key={item.id} className="group">
                        <div className="flex items-start space-x-6">
                          <div className="relative h-32 w-32 flex-shrink-0 rounded-xl overflow-hidden shadow-gold">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-luxury text-2xl font-semibold text-foreground mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  Reference: {item.sku}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-primary">
                                {formatPrice(item.price)}
                              </div>
                              
                              <div className="flex items-center space-x-3 bg-luxury-dark-grey/50 rounded-full p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                  disabled={item.quantity <= 1}
                                  className="h-10 w-10 rounded-full hover:bg-primary hover:text-black transition-all duration-300"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-semibold text-lg text-foreground">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-10 w-10 rounded-full hover:bg-primary hover:text-black transition-all duration-300"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {index < items.length - 1 && (
                          <Separator className="mt-8 bg-luxury-medium-grey/30" />
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-8 bg-luxury-medium-grey/30" />

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={clearCart}
                      className="border-red-400/50 text-red-400 hover:bg-red-400/10 hover:border-red-400 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Collection
                    </Button>
                    <Link href="/products" className="btn-luxury-outline">
                      <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                      Continue Shopping
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="bg-luxury-card shadow-luxury border-luxury sticky top-32">
                <CardContent className="p-8">
                  <h2 className="font-luxury text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    
                    {promoApplied && (
                      <div className="flex justify-between text-primary">
                        <span className="flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          Exclusive Discount (10%)
                        </span>
                        <span className="font-semibold">-{formatPrice(subtotal * 0.1)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-primary flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Complimentary
                          </span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    
                    <Separator className="bg-luxury-medium-grey/30" />
                    
                    <div className="flex justify-between text-2xl font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">
                        {formatPrice(promoApplied ? total - (subtotal * 0.1) : total)}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout" className="btn-luxury w-full inline-flex items-center justify-center gap-3 text-lg px-8 py-4 mb-6">
                    <Lock className="w-5 h-5" />
                    Secure Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  {/* Luxury Features */}
                  <div className="space-y-3 text-center text-sm">
                    <div className="flex items-center justify-center gap-6 text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Secure Payment
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Authenticity Certified
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-muted-foreground">
                      <span>30-Day Returns</span>
                      <span>•</span>
                      <span>Lifetime Support</span>
                      <span>•</span>
                      <span>2-Year Warranty</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card className="bg-luxury-card shadow-gold border-luxury">
                <CardContent className="p-6">
                  <h3 className="font-luxury text-lg font-semibold mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    Exclusive Code
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter exclusive code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-4 py-3 bg-luxury-dark-grey border border-luxury-medium-grey rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                      />
                      <Button 
                        onClick={handlePromoCode}
                        disabled={promoApplied}
                        className="btn-luxury-outline px-6"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-sm text-primary flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Exclusive code applied successfully!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Trust Signals */}
              <Card className="bg-luxury-card shadow-luxury border-luxury">
                <CardContent className="p-6">
                  <h3 className="font-luxury text-lg font-semibold mb-4 text-center">
                    Why Choose Our Collection
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Award,
                        title: "Expert Curation",
                        description: "Handpicked by horological masters"
                      },
                      {
                        icon: Shield,
                        title: "Authentication",
                        description: "Guaranteed authenticity certificate"
                      },
                      {
                        icon: Crown,
                        title: "Concierge Service", 
                        description: "White-glove delivery & support"
                      }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{feature.title}</div>
                          <div className="text-muted-foreground text-xs">{feature.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}