import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

     async authorize(credentials) {
  try {
    if (!credentials) return null;

    const res = await fetch("https://api.freeapi.app/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const result = await res.json();
    console.log("API RESULT:", result);

    const user = result?.data?.user;
    const token = result?.data?.accessToken;

    if (!res.ok || !user) {
      return null;
    }

    return {
      id: user._id || user.id,
      email: user.email,
      accessToken: token,
    };
  } catch (error) {
    console.log("ERROR:", error);
    return null;
  }
}
    }),
  ],

   session: {
    strategy: "jwt",
    maxAge: 60 * 2, // ✅ 5 minutes
  },

  jwt: {
    maxAge: 60 * 5, // ✅ 5 minutes (important!)
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  // debug: true, 
};