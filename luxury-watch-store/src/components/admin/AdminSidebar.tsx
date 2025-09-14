"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Settings,
  FileText,
  TrendingUp,
  Palette,
  Globe,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "Products",
    icon: Package,
    children: [
      { name: "All Products", href: "/admin/products" },
      { name: "Add Product", href: "/admin/products/new" },
      { name: "Categories", href: "/admin/categories" },
      { name: "Inventory", href: "/admin/inventory" },
    ],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Analytics",
    icon: TrendingUp,
    children: [
      { name: "Overview", href: "/admin/analytics" },
      { name: "Sales Report", href: "/admin/analytics/sales" },
      { name: "Product Performance", href: "/admin/analytics/products" },
      { name: "Customer Insights", href: "/admin/analytics/customers" },
    ],
  },
  {
    name: "Marketing",
    icon: Palette,
    children: [
      { name: "Promotions", href: "/admin/promotions" },
      { name: "Email Campaigns", href: "/admin/marketing/email" },
      { name: "SEO", href: "/admin/marketing/seo" },
    ],
  },
  {
    name: "Content",
    icon: FileText,
    children: [
      { name: "Pages", href: "/admin/pages" },
      { name: "Blog Posts", href: "/admin/blog" },
      { name: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    children: [
      { name: "General", href: "/admin/settings" },
      { name: "Payment", href: "/admin/settings/payment" },
      { name: "Shipping", href: "/admin/settings/shipping" },
      { name: "Taxes", href: "/admin/settings/taxes" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Products"]);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isChildActive = (children: any[]) => 
    children.some(child => pathname === child.href);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-8 px-4 space-y-2">
        {navigation.map((item) => {
          if (item.children) {
            const isExpanded = expandedItems.includes(item.name);
            const hasActiveChild = isChildActive(item.children);

            return (
              <div key={item.name}>
                <Button
                  variant="ghost"
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full justify-between text-left font-normal ${
                    hasActiveChild ? 'bg-gray-100 text-black' : 'text-gray-700 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {isExpanded && (
                  <div className="mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.name}
                        asChild
                        variant="ghost"
                        className={`w-full justify-start text-left font-normal pl-12 ${
                          isActive(child.href)
                            ? 'bg-gold/10 text-gold border-r-2 border-gold'
                            : 'text-gray-600 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        <Link href={child.href}>
                          {child.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Button
              key={item.name}
              asChild
              variant="ghost"
              className={`w-full justify-start text-left font-normal ${
                isActive(item.href!)
                  ? 'bg-gold/10 text-gold border-r-2 border-gold'
                  : 'text-gray-700 hover:text-black hover:bg-gray-50'
              }`}
            >
              <Link href={item.href!}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 px-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Orders</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Products</span>
              <span className="font-medium">156</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Revenue (MTD)</span>
              <span className="font-medium text-green-600">$45,678</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}