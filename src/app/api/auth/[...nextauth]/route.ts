// 2. Update the routes.ts (auth configuration):
import NextAuth from 'next-auth';
import { authOptions } from './auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
