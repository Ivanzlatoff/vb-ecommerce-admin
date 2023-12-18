import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import SettingsForm from "./components/SettingsForm";


interface SettingsPageProps {
  params: {
    storeId: string
  }
}


const SettingsPage: React.FC<SettingsPageProps> = async ({
  params
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.userId;

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export default SettingsPage;
