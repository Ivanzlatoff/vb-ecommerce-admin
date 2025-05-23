import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";
import { PageProps } from "@/.next/types/app/[locale]/layout";


interface CartItem extends Product {
  quantity: String
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://vb-ecommerce-store.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-type, Authorization",
  "Accept-Language": "en-US"
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
};

export async function POST(
  req: Request,
  { params }: PageProps
) {
  const { storeId } = await Promise.resolve(params);
  const { cartItems } = await req.json();

  if (cartItems.length === 0) {
    return new NextResponse("At least one product is required.", { status: 400 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  cartItems.forEach((cartItem: CartItem) => {
    line_items.push({
      quantity: Number(cartItem.quantity),
      price_data: {
        currency: 'UAH',
        product_data: {
          name: cartItem.name
        },
        unit_amount: Number(cartItem.price) * 100
      }
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: storeId,
      isPaid: false,
      orderItems: {
        create: cartItems.map((cartItem: CartItem) => ({
          product: {
            connect: {
              id: cartItem.id
            }
          },
          quantity: Number(cartItem.quantity)
        }))
      }
    }
  });
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
    metadata: {
      orderId: order.id
    }
  });
 
  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
}