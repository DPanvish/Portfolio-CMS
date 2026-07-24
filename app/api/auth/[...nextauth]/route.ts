import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {

      if (user.email === process.env.ADMIN_EMAIL) {
        return true;
      }
      return false; 
    },
  },
  pages: {
    signIn: "/login", 
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };