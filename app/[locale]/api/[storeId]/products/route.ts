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
    const { 
      userId, 
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
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Pice is required", { status: 400 });
    }

    if (!categories || !images.length) {
      return new NextResponse("At least one category required", { status: 400 });
    }
  
    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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
    };

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

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        categories: {
          connect: categoriesToCreate
        },
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        storeId: storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: {url: string }) => image)
            ]
          }
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('PRODUCT_POST', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: PageProps
) {
  try {
    const { storeId } = await Promise.resolve(params);
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        categories: {
          some: {
            id: categoryId
          }
        }
      },
      include: {
        images: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('PRODUCTS_GET', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}