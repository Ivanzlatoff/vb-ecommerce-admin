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
    const { userId, label, imageUrl } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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

    const billboard = await prismadb.billboard.create({
      data: {
        label, 
        imageUrl,
        storeId: storeId
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('BILLBOARDS_POST', error);
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

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: storeId
      }
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('BILLBOARDS_GET', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}