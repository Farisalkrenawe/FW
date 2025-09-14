"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Package,
  AlertTriangle
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  brand: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  featured: boolean;
  images: { url: string; isPrimary: boolean; altText?: string }[];
  inventory: { quantity: number; lowStockAlert: number } | null;
  category: { name: string };
  createdAt: string;
}

interface ProductsDataTableProps {
  products: Product[];
  loading: boolean;
  onDelete: (productId: string) => void;
}

export function ProductsDataTable({ products, loading, onDelete }: ProductsDataTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-800' },
      DRAFT: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800' },
      ARCHIVED: { label: 'Archived', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`text-xs ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getStockStatus = (inventory: Product['inventory']) => {
    if (!inventory) {
      return <Badge className="bg-gray-100 text-gray-800 text-xs">No Stock Data</Badge>;
    }

    if (inventory.quantity === 0) {
      return <Badge className="bg-red-100 text-red-800 text-xs">Out of Stock</Badge>;
    }

    if (inventory.quantity <= inventory.lowStockAlert) {
      return <Badge className="bg-orange-100 text-orange-800 text-xs">Low Stock</Badge>;
    }

    return <Badge className="bg-green-100 text-green-800 text-xs">In Stock</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first product to get started.
        </p>
        <Button asChild>
          <Link href="/admin/products/new">
            Add Product
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-700">
            {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              Bulk Edit
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">SKU</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Price</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Stock</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
                
                return (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.altText || product.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {product.brand} • {product.category.name}
                          </div>
                          {product.featured && (
                            <Badge className="bg-gold/10 text-gold text-xs mt-1">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm font-mono">{product.sku}</td>
                    <td className="py-3 px-2 font-semibold">{formatPrice(product.price)}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        {getStockStatus(product.inventory)}
                        {product.inventory && (
                          <span className="text-sm text-gray-600">
                            ({product.inventory.quantity})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">{getStatusBadge(product.status)}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/shop/${product.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(product.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => {
          const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
          
          return (
            <div key={product.id} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.altText || product.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.brand} • {product.sku}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(product.status)}
                        {getStockStatus(product.inventory)}
                        {product.featured && (
                          <Badge className="bg-gold/10 text-gold text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(product.price)}</div>
                      <div className="flex items-center space-x-1 mt-2">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/shop/${product.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(product.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination could go here */}
    </div>
  );
}