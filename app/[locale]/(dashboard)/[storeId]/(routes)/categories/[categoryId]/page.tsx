import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/CategoryForm";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";
import { PageProps } from "@/.next/types/app/[locale]/layout";


const CategoryPage = async ({
  params
}: PageProps) => {
  const { categoryId, storeId } = await Promise.resolve(params);
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId
    }
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <CategoryForm 
            billboards={billboards}
            initialData={category} 
          />
        </RoleGate>
      </div>
    </div>
  )
}

export default CategoryPage;
