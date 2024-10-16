// 1. First, update the next-auth.d.ts file:
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface JWT {
    accessToken?: string
  }
}