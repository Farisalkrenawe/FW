import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for now - will be replaced with actual database queries
const products = [
  {
    id: "1",
    name: "Rolex Submariner Date",
    sku: "ROL-SUB-126610LN",
    price: 8950.00,
    stock: 12,
    category: "Rolex",
    status: "Active",
    image: "https://images.unsplash.com/photo-1548181048-dab5c1b4a746?w=100&h=100&fit=crop"
  },
  {
    id: "2",
    name: "Omega Speedmaster Professional",
    sku: "OMG-SPD-310.30.42.50.01.001",
    price: 6350.00,
    stock: 8,
    category: "Omega",
    status: "Active",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=100&h=100&fit=crop"
  },
  {
    id: "3",
    name: "Patek Philippe Calatrava",
    sku: "PP-CAL-5227G-001",
    price: 32400.00,
    stock: 3,
    category: "Patek Philippe",
    status: "Active",
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=100&h=100&fit=crop"
  },
  {
    id: "4",
    name: "Audemars Piguet Royal Oak",
    sku: "AP-RO-15400ST.OO.1220ST.03",
    price: 27400.00,
    stock: 0,
    category: "Audemars Piguet",
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=100&h=100&fit=crop"
  },
];

export default function ProductsPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-2">Manage your luxury watch inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Products ({products.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your product catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-gray-400 font-medium">Product</th>
                  <th className="text-left p-4 text-gray-400 font-medium">SKU</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Price</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Stock</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                          <div className="text-sm text-gray-400">Luxury Watch</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-mono">{product.sku}</td>
                    <td className="p-4 text-white font-semibold">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 5
                            ? "bg-green-900 text-green-300"
                            : product.stock > 0
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{product.category}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === "Active"
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{products.length}</div>
            <p className="text-xs text-yellow-500">Active inventory</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Low Stock
            </CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {products.filter(p => p.stock < 5).length}
            </div>
            <p className="text-xs text-red-500">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg. Price
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString()}
            </div>
            <p className="text-xs text-green-500">Per product</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Value
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
            </div>
            <p className="text-xs text-blue-500">Inventory value</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}