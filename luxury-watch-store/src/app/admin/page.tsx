import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Watch,
  Settings,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Products",
      value: "89",
      change: "+3",
      icon: Package,
      color: "text-green-600"
    },
    {
      title: "Orders",
      value: "567",
      change: "+23%",
      icon: ShoppingCart,
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: "$12,345",
      change: "+18%",
      icon: DollarSign,
      color: "text-yellow-600"
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-2">Welcome back, {session.user.name}!</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-black">
              View Store
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-yellow-500 mt-1">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Settings className="h-5 w-5 text-yellow-500" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/products/new">
              <Button className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-black">
                <Package className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </Link>
            <Link href="/admin/customers">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">
              Latest actions on your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New order received</p>
                  <p className="text-xs text-gray-400">Rolex Submariner - $8,500</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New user registered</p>
                  <p className="text-xs text-gray-400">john.doe@example.com</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Product updated</p>
                  <p className="text-xs text-gray-400">Omega Speedmaster - Stock updated</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Info */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-400">Name:</span>
              <p className="text-white">{session.user.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-400">Email:</span>
              <p className="text-white">{session.user.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-400">Role:</span>
              <p className="text-yellow-500 font-semibold">{session.user.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}