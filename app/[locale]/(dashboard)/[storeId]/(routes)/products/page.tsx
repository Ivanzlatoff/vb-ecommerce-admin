import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import ProductClient from "./components/ProductClient";
import { ProductColumn } from "./components/ProductColumns";
import { formatter } from "@/lib/utils";
import { PageProps } from "@/.next/types/app/[locale]/layout";



const ProductsPage = async ({
  params
}: PageProps) => {
  const { storeId } = await Promise.resolve(params);
  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId
    },
    include: {
      categories: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    categories: item.categories,
    size: item.size.name,
    color: item.color.value,
    description: item.description,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage;
