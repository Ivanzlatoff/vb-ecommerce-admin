import prismadb from "@/lib/prismadb";
import SizeForm from "./components/SizeForm";
import { UserRole } from "@prisma/client";
import RoleGate from "@/components/auth/RoleGate";
import { PageProps } from "@/.next/types/app/[locale]/layout";


const SizePage = async ({
  params
}: PageProps) => {
  const { sizeId } = await Promise.resolve(params);
  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <SizeForm initialData={size} />
        </RoleGate>
      </div>
    </div>
  )
}

export default SizePage;
