import prismadb from "@/lib/prismadb";
import SizeForm from "./components/SizeForm";
import { UserRole } from "@prisma/client";
import RoleGate from "@/components/auth/RoleGate";


const SizePage = async ({
  params
}: {
  params: { sizeId: string }
}) => {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId
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
