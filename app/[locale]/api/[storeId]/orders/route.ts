import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';

import prismadb from "@/lib/prismadb";
import { Color, Product } from "@prisma/client";


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
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    } 
    const { cartItems, name, email, phone, address } = await req.json();
    
    if (!cartItems) {
      return new NextResponse("Необхідно вибрати принаймні один продукт", { status: 400 });
    }

    if (cartItems.length === 0) {
      return new NextResponse("Потрібен принаймні один продукт.", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Ім'я обов'язкове", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Телеіон обов'язковий", { status: 400 });
    }

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        name,
        phone,
        email,
        address,
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
      } catch(err) {
        console.error(`Error sending email: ${err}`);
      }
    }
    
    const productDetails = cartItems.map((
      { name, quantity, price, color }: 
      {name: string, quantity: number, price: string, color: Color}
      ) => {
      return (
          `Продукт: ${name} ${color.name}
          Кількість: ${quantity} кг
          Ціна за 100 кг: ${price} грн
          Усього за товар: ${quantity * Number(price)} грн
          `
      )
    });

    const orderPrice = cartItems.reduce((total: number, item: CartItem) => {
      return total + (Number(item.price) * Number(item.quantity))
    }, 0 );

    const textMessage = `
        Привіт,
    
        Дякуємо за вашу заявку. Ми раді повідомити, що ваше замовлення успішно отримано і один з наших працівників зв'яжеться з вами.
    
        Деталі вашого замовлення наведені нижче:
    
        Товари:
        
        ${productDetails}
    
        Усього разом: ${orderPrice} грн.
    
        Якщо ви маєте будь-які питання або побажання, будь ласка, зв'яжіться з нами за допомогою електронної пошти або телефону, зазначених на нашому веб-сайті.
    
        Дякуємо, що обрали наш магазин.
    
        З повагою,
        Команда магазину.
    `;
    sendEmail(email, 'Підтвердження замовлення', textMessage);
  
    return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}/cart?success=1` }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('ORDER_POST', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {  
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const orders = await prismadb.order.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        orderItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.log('ORDERS_GET', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}