import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, orderId: string}}
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const body = await req.json();

    const { selectedValue } = body

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    const order = await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: selectedValue
      }
    })

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, orderId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const order = await prismadb.order.deleteMany({
      where: {
        id: params.orderId,
      }
    });

    return NextResponse.json(order);

  } catch (error) {
    console.log('[ORDER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

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