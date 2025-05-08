import prismadb from "@/lib/prismadb";
import ProductForm from "./components/ProductForm";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";
import { PageProps } from "@/.next/types/app/[locale]/layout";


const ProductPage = async ({
  params
}: PageProps) => {
  const { productId, storeId } = await Promise.resolve(params);
  const product = await prismadb.product.findUnique({
    where: {
      id: productId
    },
    include: {
      images: true,
      categories: true
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId
    }
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId
    }
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: storeId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <ProductForm 
            initialData={product} 
            categories={categories}
            sizes={sizes}
            colors={colors}
          />
        </RoleGate>
      </div>
    </div>
  )
}

export default ProductPage;
