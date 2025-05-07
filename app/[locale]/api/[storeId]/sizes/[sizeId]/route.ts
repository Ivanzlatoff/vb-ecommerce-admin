import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";


export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    const { sizeId } = await Promise.resolve(params);
    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 })
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      }
    });

    return NextResponse.json(size);

  } catch (error) {
    console.log('[SIZE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, sizeId: string }}
) {
  try {
    const { storeId, sizeId } = await Promise.resolve(params);
    const session = await auth();
    const userId = session?.user.id;
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }
  
    if (!value) {
      return new NextResponse("Value is required", { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 })
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

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(name);

  } catch (error) {
    console.log('[SIZE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {
    const { storeId, sizeId } = await Promise.resolve(params);
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 })
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
      }
    });

    return NextResponse.json(size);

  } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


