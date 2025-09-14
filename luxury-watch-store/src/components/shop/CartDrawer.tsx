"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Truck, 
  ArrowRight,
  Trash2
} from "lucide-react";
import { useCart } from "@/store/cart";

// Simple price formatting function
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();
  
  const [isClearing, setIsClearing] = useState(false);
  
  // Calculate cart totals
  const subtotal = totalPrice;
  const tax = subtotal * 0.08875; // 8.875% tax
  const shipping = subtotal >= 1000 ? 0 : 25; // Free shipping over $1000
  const total = subtotal + tax + shipping;
  const freeShippingRemaining = Math.max(0, 1000 - subtotal);

  const handleClearCart = async () => {
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief animation delay
    clearCart();
    setIsClearing(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <ShoppingBag className="h-5 w-5 text-yellow-500" />
              Shopping Cart ({totalItems})
            </h2>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={closeCart}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-400 mb-6">
                  Add some luxury timepieces to get started
                </p>
                <Button asChild onClick={closeCart} className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                  <Link href="/shop">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress */}
              {freeShippingRemaining > 0 && (
                <div className="p-4 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Free shipping at $1,000</span>
                    <span className="font-medium text-white">{formatPrice(freeShippingRemaining)} to go</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((subtotal / 1000) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => {

                  return (
                    <Card key={item.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 space-y-2">
                            <div>
                              <Link 
                                href={`/product/${item.slug}`}
                                onClick={closeCart}
                                className="font-medium text-sm text-white hover:text-yellow-500 transition-colors line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="text-xs text-gray-400">
                                {item.brand}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold text-white">
                                {formatPrice(item.price)}
                              </div>
                              {!item.inStock && (
                                <Badge variant="destructive" className="text-xs">
                                  Out of Stock
                                </Badge>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gray-600 rounded">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-7 w-7 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm text-white">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-7 w-7 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <div className="text-sm font-semibold text-white">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-800 p-4 space-y-4">
                {/* Subtotal, Tax, Shipping */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span className="font-medium text-white">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-medium text-white">
                      {shipping === 0 ? (
                        <span className="text-green-500 flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          FREE
                        </span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-lg text-yellow-500">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
                    onClick={closeCart}
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-full border-gray-600 text-white hover:bg-gray-800"
                    onClick={closeCart}
                  >
                    <Link href="/cart">
                      View Full Cart
                    </Link>
                  </Button>
                </div>

                {/* Security & Guarantee */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <div className="flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1">
                      🔒 Secure Checkout
                    </span>
                    <span className="flex items-center gap-1">
                      ✅ Authenticity Guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}