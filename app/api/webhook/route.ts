import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";


sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const sendEmail = async (to: string, subject: string, text: string) => {
  const message = {
    to,
    from: 'vinogradnik.bessarabii@gmail.com',
    bcc: 'vinogradnik.bessarabii@gmail.com',
    subject,
    text,        
  };

  try {
    await sgMail.send(message);
    console.log(`Email sent to ${to}`);
  } catch(err) {
    console.error(`Error sending email: ${err}`);
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');
  
  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        name: session?.customer_details?.name || '',
        email: session?.customer_details?.email || '',
        phone: session?.customer_details?.phone || ''
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                color: true
              }
            }
          }
        },
      }
    });

    const productDetails = order.orderItems.map(({ product, quantity }) => {
      return (
          `  Продукт: ${product.name} ${product.color.name}
          Кількість: ${quantity} кг
          Ціна за 100 кг: ${product.price} грн
          Усього за товар: ${quantity * Number(product.price)} грн
          `
      )
    });

    const orderPrice = order.orderItems.reduce((total, item) => {
      return total + (Number(item.product.price) * Number(item.quantity))
    }, 0 );

    const textMessage = `
        Привіт,
    
        Дякуємо за ваше замовлення в нашому магазині. Ми раді повідомити, що ваше замовлення успішно отримано і готується до відправки.
    
        Деталі вашого замовлення наведені нижче:
    
        Товари:
        
        ${productDetails}
    
        Усього разом: ${orderPrice} грн.
    
        Ми надішлемо ваше замовлення в найближчий час. Якщо ви маєте будь-які питання або побажання, будь ласка, зв'яжіться з нами за допомогою електронної пошти або телефону, зазначених на нашому веб-сайті.
    
        Дякуємо, що обрали наш магазин.
    
        З повагою,
        Команда магазину.
    `;
    sendEmail(order.email, 'Підтвердження замовлення', textMessage);
  }

  return new NextResponse(null, { status: 200 });
}