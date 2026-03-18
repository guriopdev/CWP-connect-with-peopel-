import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get("mode");
        const userId2 = searchParams.get("userId");
        const senderId = searchParams.get("senderId");

        if (mode === "global") {
            const messages = await prisma.message.findMany({
                where: { receiverId: null },
                include: { sender: { select: { id: true, name: true, image: true, username: true } } },
                orderBy: { createdAt: "asc" },
                take: 50,
            });
            return NextResponse.json(messages);
        } else if (mode === "dm" && userId2 && senderId) {
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: senderId, receiverId: userId2 },
                        { senderId: userId2, receiverId: senderId },
                    ]
                },
                include: { sender: { select: { id: true, name: true, image: true, username: true } } },
                orderBy: { createdAt: "asc" },
                take: 50,
            });
            return NextResponse.json(messages);
        }

        return NextResponse.json([]);
    } catch (err: any) {
        return new NextResponse(err.message || "Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { content, receiverId } = body;

        if (!content) {
            return new NextResponse("Content is required", { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: session.user.id as string,
                receiverId: receiverId || null,
            },
            include: { sender: { select: { id: true, name: true, image: true, username: true } } }
        });

        return NextResponse.json(message);
    } catch (err: any) {
        return new NextResponse(err.message || "Internal Server Error", { status: 500 });
    }
}
