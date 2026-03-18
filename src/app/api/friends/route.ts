import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET friend requests (sent and received)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const friendSelect = { id: true, name: true, username: true, image: true, bio: true, country: true, education: true };

        const [sent, received] = await Promise.all([
            prisma.friendRequest.findMany({
                where: { senderId: session.user.id },
                include: { receiver: { select: friendSelect } },
                orderBy: { createdAt: "desc" },
            }),
            prisma.friendRequest.findMany({
                where: { receiverId: session.user.id },
                include: { sender: { select: friendSelect } },
                orderBy: { createdAt: "desc" },
            })
        ]);

        return NextResponse.json({ sent, received });
    } catch (error: any) {
        console.error("Error fetching friend requests:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

// POST send a friend request
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { receiverId, action, requestId } = body;

        // Accept or reject
        if (action === "accept" || action === "reject") {
            if (!requestId) {
                return NextResponse.json({ error: "requestId required" }, { status: 400 });
            }
            await prisma.friendRequest.update({
                where: { id: requestId },
                data: { status: action === "accept" ? "accepted" : "rejected" },
            });
            return NextResponse.json({ success: true });
        }

        // Send new request
        if (!receiverId) {
            return NextResponse.json({ error: "receiverId required" }, { status: 400 });
        }
        if (receiverId === session.user.id) {
            return NextResponse.json({ error: "Cannot send request to yourself" }, { status: 400 });
        }

        // Check if request already exists
        const existing = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId },
                    { senderId: receiverId, receiverId: session.user.id },
                ],
            },
        });

        if (existing) {
            return NextResponse.json({ error: "Request already exists", status: existing.status }, { status: 409 });
        }

        const request = await prisma.friendRequest.create({
            data: { senderId: session.user.id, receiverId },
        });

        return NextResponse.json(request);
    } catch (error: any) {
        console.error("Error with friend request:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
