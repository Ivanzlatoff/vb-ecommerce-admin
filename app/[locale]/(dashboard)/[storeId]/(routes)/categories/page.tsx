import { Locale, format } from "date-fns";
import { uk, ru, enGB } from 'date-fns/locale'

import prismadb from "@/lib/prismadb";

import CategoryClient from "./components/CategoryClient";
import { CategoryColumn } from "./components/CategoryColumns";
import { PageProps } from "@/.next/types/app/[locale]/layout";


const CategoriesPage = async ({
  params
}: PageProps) => {
  const { locale, storeId } = await Promise.resolve(params);
  const currentLocale: Locale = locale === 'uk' ? uk : locale === 'ru' ? ru : enGB;

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId
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
