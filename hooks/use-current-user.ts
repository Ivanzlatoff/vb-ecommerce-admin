import { useSession } from "next-auth/react";


export const useCurrentUser = () => {
  const session = useSession({
    required: true,
    onUnauthenticated() {
        console.log("Unauthenticated")
    },
  });

  return session?.data?.user;
}