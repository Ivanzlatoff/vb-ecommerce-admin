import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prismadb from "./prismadb";
import { compare } from "bcrypt";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/sign-in'
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "username@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) {
          return null
        }

        const existingUser = await prismadb.user.findUnique({
          where: { email: credentials?.email }
        });

        if (!existingUser) {
          return null;
        }

        if (existingUser.password) {
          const passwordMatch = await compare(credentials.password, existingUser.password);
          if(!passwordMatch) {
            return null;
          }
        }

        
        return {
          id: existingUser.id + '',
          username: existingUser.username,
          email: existingUser.email
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          userId: token.sub,
          ...token,
          username: user.username
        }
      }
      return token
    },
    async session({ session, token, user }) {      
      return {
        ...session,
        user: {
          userId: token.sub,
          ...session.user,
          username: token.username,
        }
      }
    }
  }
}