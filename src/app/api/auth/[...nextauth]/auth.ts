import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // callbacks: {
  //   async jwt({ token, account,user }) {
  //     // Persist the OAuth access_token to the token right after signin
  //     if (account && user) {
  //       token.accessToken = account.access_token;
  //       token.user = user;
  //     }
  //     return token
  //   },
  //   async session({ session, token }) {
  //     // Send properties to the client
  //     session.accessToken = token.accessToken as string
  //     if (token.user) {
  //       session.user = token.user;
  //     }
  //     return session;
  //     },
  // },
};
