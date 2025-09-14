import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const {
      items,
      shippingAddress,
      billingAddress,
      email,
      promoCode
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Calculate order totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      // Fetch current product data to ensure prices and availability
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { inventory: true }
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.inventory && product.inventory.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: item.quantity,
        total: itemTotal,
        variantId: item.variantId || null
      });
    }

    // Apply promo code discount
    let discount = 0;
    if (promoCode === 'WELCOME10') {
      discount = subtotal * 0.1; // 10% discount
    }

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.08; // 8% tax
    const shipping = discountedSubtotal >= 1000 ? 0 : 50; // Free shipping over $1000
    const total = discountedSubtotal + tax + shipping;

    // Generate unique order number
    const orderNumber = `LW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(total),
      currency: 'usd',
      metadata: {
        orderNumber,
        customerEmail: email,
        itemCount: items.length.toString(),
      },
      shipping: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        address: {
          line1: shippingAddress.address1,
          line2: shippingAddress.address2 || undefined,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country || 'US',
        },
      },
      receipt_email: email,
      description: `Luxury Watch Store - Order ${orderNumber}`,
    });

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        email,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod: 'stripe',
        stripePaymentId: paymentIntent.id,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        items: {
          create: validatedItems.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Reserve inventory
    for (const item of validatedItems) {
      await prisma.inventory.update({
        where: { productId: item.productId },
        data: {
          reserved: {
            increment: item.quantity
          }
        }
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}