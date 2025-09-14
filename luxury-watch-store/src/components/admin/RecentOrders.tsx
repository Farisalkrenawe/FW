"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const recentOrders = [
  {
    id: "LW-12345",
    customer: "John Smith",
    email: "john@example.com",
    total: 8950,
    status: "processing",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "LW-12344",
    customer: "Sarah Johnson",
    email: "sarah@example.com", 
    total: 6350,
    status: "shipped",
    createdAt: "2024-01-15T09:15:00Z"
  },
  {
    id: "LW-12343",
    customer: "Mike Davis",
    email: "mike@example.com",
    total: 2450,
    status: "delivered",
    createdAt: "2024-01-14T16:20:00Z"
  },
  {
    id: "LW-12342",
    customer: "Emily Wilson",
    email: "emily@example.com",
    total: 10500,
    status: "pending",
    createdAt: "2024-01-14T14:45:00Z"
  }
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800", 
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

export function RecentOrders() {
  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{order.id}</span>
              <Badge className={`text-xs ${statusColors[order.status as keyof typeof statusColors]}`}>
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{order.customer}</p>
            <p className="text-xs text-gray-500">{order.email}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-sm">
              {formatPrice(order.total)}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}