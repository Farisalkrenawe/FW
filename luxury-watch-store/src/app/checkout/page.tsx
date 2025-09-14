"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  ShoppingBag,
  Truck,
  Shield,
  Watch
} from "lucide-react";
import { useCart } from "@/store/cart";
import toast from "react-hot-toast";

// Mock Stripe integration for demo
const processPayment = async (paymentData: any) => {
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate 95% success rate
  if (Math.random() > 0.05) {
    return {
      success: true,
      paymentIntentId: `pi_${Math.random().toString(36).substring(2, 15)}`,
      orderId: `order_${Math.random().toString(36).substring(2, 15)}`
    };
  } else {
    throw new Error('Payment failed. Please try again.');
  }
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Review

  // Checkout form data
  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    
    // Shipping Address
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    country: 'US',
    state: '',
    postalCode: '',
    phone: '',
    
    // Billing Address
    useShippingAddress: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    
    // Options
    saveInformation: false,
    emailUpdates: true,
  });

  // Calculate totals
  const subtotal = totalPrice;
  const tax = subtotal * 0.08875; // 8.875% tax
  const shipping = subtotal >= 1000 ? 0 : 25; // Free shipping over $1000
  const total = subtotal + tax + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/shop');
      toast.error('Your cart is empty');
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        // Validate contact and shipping info
        const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'postalCode'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(', ')}`);
          return false;
        }
        return true;
      
      case 2:
        // Validate payment info
        const paymentFields = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
        const missingPaymentFields = paymentFields.filter(field => !formData[field as keyof typeof formData]);
        if (missingPaymentFields.length > 0) {
          toast.error(`Please fill in payment information`);
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return;
    
    setLoading(true);
    try {
      const paymentData = {
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        customer: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
        },
        shipping: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: {
            line1: formData.address,
            line2: formData.apartment,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
          },
        },
        items: items,
      };

      const result = await processPayment(paymentData);
      
      if (result.success) {
        // Clear cart
        clearCart();
        
        // Show success message
        toast.success('Order placed successfully!');
        
        // Redirect to success page
        router.push(`/checkout/success?order=${result.orderId}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/shop">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-300">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step >= stepNumber 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-700 text-gray-400'
                    }
                  `}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`
                      w-16 h-0.5 mx-2
                      ${step > stepNumber ? 'bg-yellow-500' : 'bg-gray-700'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {step === 1 && (
                <>
                  {/* Contact Information */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="company" className="text-gray-300">Company (Optional)</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address" className="text-gray-300">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="apartment" className="text-gray-300">Apartment, suite, etc. (Optional)</Label>
                        <Input
                          id="apartment"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-gray-300">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-gray-300">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="CA"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode" className="text-gray-300">ZIP Code</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleNext}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Payment Information */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="nameOnCard" className="text-gray-300">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          name="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800 px-8"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8"
                    >
                      Review Order
                    </Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  {/* Order Review */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Review Your Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Email:</span>
                          <span className="text-white">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Ship to:</span>
                          <span className="text-white text-right">
                            {formData.firstName} {formData.lastName}<br/>
                            {formData.address}, {formData.city}, {formData.state} {formData.postalCode}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Payment:</span>
                          <span className="text-white">**** **** **** {formData.cardNumber.slice(-4)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800 px-8"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8"
                    >
                      {loading ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Order Summary ({totalItems} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 bg-gray-800 rounded">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium line-clamp-2">
                            {item.name}
                          </div>
                          <div className="text-gray-400 text-xs">{item.brand}</div>
                          <div className="text-white text-sm font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax</span>
                      <span className="text-white">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">
                        {shipping === 0 ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            FREE
                          </span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-white">Total</span>
                      <span className="text-yellow-500">{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="text-white font-medium">Secure Payment</div>
                        <div className="text-gray-400 text-xs">SSL encrypted checkout</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Truck className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="text-white font-medium">Free Shipping</div>
                        <div className="text-gray-400 text-xs">On orders over $1,000</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Watch className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="text-white font-medium">Authenticity Guaranteed</div>
                        <div className="text-gray-400 text-xs">100% authentic timepieces</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}