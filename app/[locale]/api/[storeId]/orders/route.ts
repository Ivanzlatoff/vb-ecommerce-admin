import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { PageProps } from "@/.next/types/app/[locale]/layout";

export async function GET(
  req: Request,
  { params }: PageProps
) {
  try {  
    const { storeId } = await Promise.resolve(params);
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const orders = await prismadb.order.findMany({
      where: {
        storeId: storeId,
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