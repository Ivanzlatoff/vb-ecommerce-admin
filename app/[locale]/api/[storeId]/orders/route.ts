import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

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