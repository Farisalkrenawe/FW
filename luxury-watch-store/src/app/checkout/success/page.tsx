"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Mail,
  Package,
  ArrowRight,
  Home,
  ShoppingBag
} from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const order = searchParams.get('order');
    if (order) {
      setOrderNumber(order);
    } else {
      // Redirect if no order number
      router.push('/shop');
    }
  }, [searchParams, router]);

  if (!orderNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          </div>

          {/* Main Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {/* Order Details Card */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-gray-400 text-sm">Order Number</div>
                <div className="text-yellow-500 font-mono font-bold text-lg">
                  {orderNumber}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-300">Confirmation email sent</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Package className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-300">Processing your order</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <div className="text-white font-medium">Order Confirmation</div>
                  <div className="text-gray-400 text-sm">You'll receive an email confirmation with your order details</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <div className="text-white font-medium">Quality Check</div>
                  <div className="text-gray-400 text-sm">Our experts will authenticate and inspect your timepiece</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <div className="text-white font-medium">Secure Shipping</div>
                  <div className="text-gray-400 text-sm">Your watch will be carefully packaged and shipped with tracking</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="text-center text-gray-400 text-sm">
              Questions about your order?{" "}
              <a href="mailto:support@luxurywatch.com" className="text-yellow-500 hover:underline">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}