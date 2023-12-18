import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    username: string | null,
    userId?: string
  }
  interface Session {
    user: User & {
      username: string,
    }
    token: {
      username: string,
      userId: string
    }
    expires: string
  }
}