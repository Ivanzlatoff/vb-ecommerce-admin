import prismadb from "@/lib/prismadb";
import ColorForm from "./components/ColorForm";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";
import { PageProps } from "@/.next/types/app/[locale]/layout";


const ColorPage = async ({
  params
}: PageProps) => {
  const { colorId } = await Promise.resolve(params);
  const color = await prismadb.color.findUnique({
    where: {
      id: colorId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <ColorForm initialData={color} />
        </RoleGate>
      </div>
    </div>
  )
}

export default ColorPage;
