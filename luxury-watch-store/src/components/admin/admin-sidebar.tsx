"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Settings,
  Watch
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-800">
        <Watch className="h-8 w-8 text-yellow-500" />
        <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-1 transition-colors duration-200
                  ${
                    isActive
                      ? "bg-yellow-600 text-black"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? "text-black" : "text-gray-400 group-hover:text-white"}
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          Luxury Watch Store Admin
        </div>
      </div>
    </div>
  );
}