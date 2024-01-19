import { auth } from "@/auth";
import UserInfo from "@/components/UserInfo";
import { currentUser } from "@/lib/auth";


const ServerPage = async () => {
  const user = await currentUser();
  const session = await auth();

  return (
    <div className="flex flex-col">
      <UserInfo
        label="💻 Server Component"
        user={user}
      />
      <h2 className="mt-4">Server Session:</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>

  )
}

export default ServerPage;
