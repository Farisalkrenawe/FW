"use client";

import { formatPrice } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const topProducts = [
  {
    id: 1,
    name: "Rolex Submariner Date",
    brand: "Rolex",
    sales: 45,
    revenue: 402750,
    growth: 23.5
  },
  {
    id: 2, 
    name: "Omega Speedmaster Professional",
    brand: "Omega",
    sales: 32,
    revenue: 203200,
    growth: 18.2
  },
  {
    id: 3,
    name: "Tag Heuer Carrera Calibre 16", 
    brand: "Tag Heuer",
    sales: 28,
    revenue: 68600,
    growth: 15.7
  },
  {
    id: 4,
    name: "Rolex GMT-Master II",
    brand: "Rolex",
    sales: 24,
    revenue: 252000,
    growth: 12.3
  },
  {
    id: 5,
    name: "Omega Seamaster Planet Ocean",
    brand: "Omega", 
    sales: 19,
    revenue: 95000,
    growth: 8.9
  }
];

export function TopProducts() {
  return (
    <div className="space-y-4">
      {topProducts.map((product, index) => (
        <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-sm font-bold text-gold">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm line-clamp-1">
              {product.name}
            </div>
            <div className="text-xs text-gray-600">{product.brand}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-sm">
              {formatPrice(product.revenue)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{product.growth}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}