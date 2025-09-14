"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store/cart";
import { Loader2, CreditCard, Shield } from "lucide-react";

interface CheckoutFormProps {
  clientSecret?: string;
  onCreatePaymentIntent?: (clientSecret: string) => void;
  onSuccess?: () => void;
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  error?: string;
  onError?: (error: string) => void;
}

export function CheckoutForm({
  clientSecret,
  onCreatePaymentIntent,
  onSuccess,
  loading = false,
  onLoadingChange,
  error = "",
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [billingAddress, setBillingAddress] = useState<any>(null);
  const [useShippingForBilling, setUseShippingForBilling] = useState(true);
  const [promoCode, setPromoCode] = useState("");

  // Step 1: Collect shipping and billing information
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, clientSecret]);

  const handleCreatePaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !shippingAddress) {
      onError?.("Please fill in all required fields");
      return;
    }

    onLoadingChange?.(true);
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          email,
          shippingAddress,
          billingAddress: useShippingForBilling ? shippingAddress : billingAddress,
          promoCode: promoCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      onCreatePaymentIntent?.(data.clientSecret);
      setStep('payment');

    } catch (err: any) {
      onError?.(err.message);
    } finally {
      onLoadingChange?.(false);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message || "An error occurred");
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded
      clearCart();
      onSuccess?.();
      router.push(`/checkout/success?payment_intent=${paymentIntent.id}`);
    }

    setIsLoading(false);
  };

  // If we don't have a client secret yet, show the shipping form
  if (!clientSecret) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressElement
              options={{
                mode: 'shipping',
                allowedCountries: ['US'],
              }}
              onChange={(event) => {
                if (event.complete) {
                  setShippingAddress(event.value);
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="same-as-shipping"
                checked={useShippingForBilling}
                onChange={(e) => setUseShippingForBilling(e.target.checked)}
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <Label htmlFor="same-as-shipping" className="text-sm">
                Same as shipping address
              </Label>
            </div>

            {!useShippingForBilling && (
              <AddressElement
                options={{
                  mode: 'billing',
                  allowedCountries: ['US'],
                }}
                onChange={(event) => {
                  if (event.complete) {
                    setBillingAddress(event.value);
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Promo Code */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Promo Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button variant="outline" disabled>
                Apply
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: WELCOME10 for 10% off
            </p>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleCreatePaymentIntent}
          disabled={loading || isLoading || !email || !shippingAddress}
          className="w-full gold-gradient text-black font-semibold"
          size="lg"
        >
          {loading || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue to Payment"
          )}
        </Button>
      </div>
    );
  }

  // Payment step
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement 
            options={{
              layout: "tabs",
            }}
          />
        </CardContent>
      </Card>

      {message && (
        <div className={`rounded-lg p-4 ${
          message.includes("succeeded") 
            ? "bg-green-50 border border-green-200" 
            : "bg-red-50 border border-red-200"
        }`}>
          <p className={`text-sm ${
            message.includes("succeeded") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          disabled={isLoading || !stripe || !elements}
          className="w-full gold-gradient text-black font-semibold"
          size="lg"
          type="submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            "Complete Order"
          )}
        </Button>

        <div className="text-center text-xs text-gray-500">
          <p>
            By completing your order, you agree to our{" "}
            <a href="/terms" className="underline">Terms of Service</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </form>
  );
}