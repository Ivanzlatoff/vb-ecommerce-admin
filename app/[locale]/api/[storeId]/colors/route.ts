import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { PageProps } from "@/.next/types/app/[locale]/layout";


export async function POST(
  req: Request,
  { params }: PageProps
) {
  try {
    const { storeId } = await Promise.resolve(params);
    const body = await req.json();
    const { userId, name, value } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.create({
      data: {
        name, 
        value,
        storeId: storeId
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('COLORS_POST', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: PageProps
) {
  try {
    const { storeId } = await Promise.resolve(params);
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: storeId
      }
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log('COLORS_GET', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}