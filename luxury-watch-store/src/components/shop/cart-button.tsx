"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";

export function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={openCart}
      className="relative text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Button>
  );
}