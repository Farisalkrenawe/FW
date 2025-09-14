"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart, CartItem } from "@/store/cart";
import { useState } from "react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  brand: string;
  image: string;
  slug: string;
  inStock: boolean;
}

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  showQuantitySelector?: boolean;
}

export function AddToCartButton({ 
  product, 
  disabled = false, 
  showQuantitySelector = true 
}: AddToCartButtonProps) {
  const { items, addItem, updateQuantity, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Check if product is already in cart
  const cartItem = items.find(item => item.id === product.id);
  const isInCart = Boolean(cartItem);

  const handleAddToCart = () => {
    // Add the specified quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        comparePrice: product.comparePrice,
        brand: product.brand,
        image: product.image,
        slug: product.slug,
        sku: product.sku,
        inStock: product.inStock,
      });
    }

    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
    });

    openCart();
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (cartItem && newQuantity > 0) {
      updateQuantity(cartItem.id, newQuantity);
      toast.success(`Cart updated!`);
    }
  };

  if (isInCart && showQuantitySelector) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-600 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleUpdateQuantity(cartItem!.quantity - 1)}
            disabled={cartItem!.quantity <= 1}
            className="h-12 w-12 text-white hover:text-yellow-500"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 text-white min-w-[50px] text-center">
            {cartItem!.quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleUpdateQuantity(cartItem!.quantity + 1)}
            className="h-12 w-12 text-white hover:text-yellow-500"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={openCart}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
          size="lg"
        >
          View Cart ({cartItem!.quantity})
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showQuantitySelector && (
        <div className="flex items-center space-x-4">
          <label className="text-white font-medium">Quantity:</label>
          <div className="flex items-center border border-gray-600 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-10 w-10 text-white hover:text-yellow-500"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 text-white min-w-[50px] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="h-10 w-10 text-white hover:text-yellow-500"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={disabled}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {disabled ? 'Out of Stock' : `Add to Cart - $${(product.price * quantity).toLocaleString()}`}
      </Button>
    </div>
  );
}