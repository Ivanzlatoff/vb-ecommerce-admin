"use client";

import User from "@/components/User";
import UserInfo from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/use-current-user";


const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <div className="flex flex-col">
      <UserInfo
        label="📱 Client Component"
        user={user}
      />
      <h2 className="mt-4">Client Session:</h2>
      <User />
    </div>
  )
}

export default ClientPage;
