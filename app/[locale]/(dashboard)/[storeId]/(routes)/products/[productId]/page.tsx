import prismadb from "@/lib/prismadb";
import ProductForm from "./components/ProductForm";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";


const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId
    },
    include: {
      images: true,
      categories: true
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
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
