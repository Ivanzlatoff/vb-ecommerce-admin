import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/BillboardForm";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";
import { PageProps } from "@/.next/types/app/[locale]/layout";

const BillboardPage = async ({
  params
}: PageProps) => {
  const { billboardId } = await Promise.resolve(params);
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId
    }
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <BillboardForm initialData={billboard} />
        </RoleGate>
      </div>
    </div>
  )
}

export default BillboardPage;
