import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
import { PageProps } from "@/.next/types/app/[locale]/layout";


export async function GET(
  req: Request,
  { params }: PageProps
) {
  try {
    const { colorId } = await Promise.resolve(params);
    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 })
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      }
    });

    return NextResponse.json(color);

  } catch (error) {
    console.log('[COLOR_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: PageProps
) {
  try {
    const { storeId, colorId } = await Promise.resolve(params);
    const session = await auth();
    const userId = session?.user.id;
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }
  
    if (!value) {
      return new NextResponse("Value is required", { status: 400 })
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 })
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

    const color = await prismadb.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(name);

  } catch (error) {
    console.log('[COLOR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: PageProps
) {
  try {
    const { storeId, colorId } = await Promise.resolve(params);
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 })
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: colorId,
      }
    });

    return NextResponse.json(color);

  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


