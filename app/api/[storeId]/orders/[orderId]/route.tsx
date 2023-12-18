import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, orderId: string}}
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.userId;
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