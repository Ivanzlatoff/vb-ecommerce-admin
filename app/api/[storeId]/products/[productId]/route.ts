import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";


export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 })
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        categories: true,
        size: true,
        color: true,

      }
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, productId: string }}
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.userId;
    const body = await req.json();

    const {  
      name,
      description,
      price,
      categories,
      sizeId,
      colorId,
      images,
      isFeatured,
      isArchived
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
  
    if (!description) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Pice is required", { status: 400 });
    }

    if (!categories) {
      return new NextResponse("At least one category is required", { status: 400 });
    }
  
    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 })
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

    const categoriesByProduct = await prismadb.category.findMany({
      where: {
        id: {
          in: categories,
        },
      },
    });

    if (!categoriesByProduct) {
      return new NextResponse("No such categories exist", { status: 400 });
    };

    const categoriesToCreate = categoriesByProduct.map((categoryByProduct) => {
      return {
        id: categoryByProduct.id,
      };
    });    

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        description,
        categories: {
          set: [],
          connect: categoriesToCreate
        },
        sizeId,
        colorId,
        images: {
          deleteMany: {}
        },
        isFeatured,
        isArchived,
      }
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.userId;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 })
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      }
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


