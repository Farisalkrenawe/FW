import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find the order by Stripe payment ID
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentId: paymentIntent.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        updatedAt: new Date()
      }
    });

    // Update inventory - move from reserved to sold
    for (const item of order.items) {
      await prisma.inventory.updateMany({
        where: { 
          OR: [
            { productId: item.productId },
            { variantId: item.variantId }
          ]
        },
        data: {
          quantity: {
            decrement: item.quantity
          },
          reserved: {
            decrement: item.quantity
          }
        }
      });
    }

    // TODO: Send order confirmation email
    console.log(`Payment succeeded for order ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find the order by Stripe payment ID
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentId: paymentIntent.id
      },
      include: {
        items: true
      }
    });

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'FAILED',
        updatedAt: new Date()
      }
    });

    // Release reserved inventory
    for (const item of order.items) {
      await prisma.inventory.updateMany({
        where: { 
          OR: [
            { productId: item.productId },
            { variantId: item.variantId }
          ]
        },
        data: {
          reserved: {
            decrement: item.quantity
          }
        }
      });
    }

    // TODO: Send payment failed email
    console.log(`Payment failed for order ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find the order by Stripe payment ID
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentId: paymentIntent.id
      },
      include: {
        items: true
      }
    });

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'FAILED',
        updatedAt: new Date()
      }
    });

    // Release reserved inventory
    for (const item of order.items) {
      await prisma.inventory.updateMany({
        where: { 
          OR: [
            { productId: item.productId },
            { variantId: item.variantId }
          ]
        },
        data: {
          reserved: {
            decrement: item.quantity
          }
        }
      });
    }

    console.log(`Payment canceled for order ${order.orderNumber}`);

  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}