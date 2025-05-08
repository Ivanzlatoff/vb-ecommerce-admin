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
    const { userId, name, billboardId } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    const category = await prismadb.category.create({
      data: {
        name, 
        billboardId,
        storeId: storeId
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('CATEGORIES_POST', error);
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
    
    const categories = await prismadb.category.findMany({
      where: {
        storeId: storeId
      }
    });
    


    return NextResponse.json(categories);
  } catch (error) {
    console.log('CATEGORIES_GET', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}