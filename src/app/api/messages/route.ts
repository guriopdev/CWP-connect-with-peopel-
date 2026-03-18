import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const senderSelect = { id: true, name: true, image: true, username: true };

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get("mode");
        const userId2 = searchParams.get("userId");
        const senderId = searchParams.get("senderId");

        const includeFields = {
            sender: { select: senderSelect },
            replyTo: { select: { id: true, content: true, sender: { select: { name: true } } } }
        };

        if (mode === "global") {
            const messages = await prisma.message.findMany({
                where: { receiverId: null },
                include: includeFields,
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
                include: includeFields,
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
        const { content, receiverId, imageUrl, replyToId } = body;

        if (!content && !imageUrl) {
            return new NextResponse("Content or image is required", { status: 400 });
        }

        // Validate image URL if provided (basic validation + size limit abuse prevention)
        if (imageUrl) {
            if (imageUrl.length > 500) {
                return new NextResponse("Image URL too long (max 500 chars)", { status: 400 });
            }
            if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)/i) && !imageUrl.startsWith("https://")) {
                return new NextResponse("Invalid image URL", { status: 400 });
            }
        }

        const message = await prisma.message.create({
            data: {
                content: content || "",
                imageUrl: imageUrl || null,
                senderId: session.user.id as string,
                receiverId: receiverId || null,
                replyToId: replyToId || null,
            },
            include: {
                sender: { select: senderSelect },
                replyTo: { select: { id: true, content: true, sender: { select: { name: true } } } }
            }
        });

        return NextResponse.json(message);
    } catch (err: any) {
        return new NextResponse(err.message || "Internal Server Error", { status: 500 });
    }
}
