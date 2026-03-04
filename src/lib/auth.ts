import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/setup-profile",
    },
    callbacks: {
        async session({ session, user }: any) {
            if (session.user) {
                // @ts-ignore
                session.user.id = user.id;
                // @ts-ignore
                session.user.hasCompletedProfile = user.hasCompletedProfile;
                // @ts-ignore
                session.user.username = user.username;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
