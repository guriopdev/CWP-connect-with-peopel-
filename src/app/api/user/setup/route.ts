import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { username, bio, country, education, pronouns, image } = body;

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                username,
                bio,
                country,
                education,
                pronouns,
                image,
                hasCompletedProfile: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Profile Setup Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
