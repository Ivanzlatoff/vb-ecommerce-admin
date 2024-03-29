import { Locale, format } from "date-fns";
import { uk, ru, enGB } from 'date-fns/locale'

import prismadb from "@/lib/prismadb";

import CategoryClient from "./components/CategoryClient";
import { CategoryColumn } from "./components/CategoryColumns";


const CategoriesPage = async ({
  params,
  params: { locale }
}: {
  params: { locale: string, storeId: string }
}) => {

  const currentLocale: Locale = locale === 'uk' ? uk : locale === 'ru' ? ru : enGB;

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy", { locale: currentLocale })
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage;
