// 1. First, update the next-auth.d.ts file:
/* eslint-disable @typescript-eslint/no-unused-vars */
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