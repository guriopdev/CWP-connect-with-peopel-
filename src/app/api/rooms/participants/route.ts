import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET participants for a room
export async function GET(req: NextRequest) {
    try {
        const roomId = req.nextUrl.searchParams.get("roomId");
        if (!roomId) {
            return NextResponse.json({ error: "roomId is required" }, { status: 400 });
        }

        // Clean up stale participants (last seen > 30 seconds ago)
        await prisma.roomParticipant.deleteMany({
            where: {
                roomId,
                lastSeen: { lt: new Date(Date.now() - 30000) },
            },
        });

        const participants = await prisma.roomParticipant.findMany({
            where: { roomId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                        bio: true,
                        country: true,
                        education: true,
                    },
                },
            },
            orderBy: { joinedAt: "asc" },
        });

        return NextResponse.json(participants);
    } catch (error: any) {
        console.error("Error fetching participants:", error);
        return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 });
    }
}

// POST join a room / heartbeat
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { roomId, action } = body;

        if (!roomId) {
            return NextResponse.json({ error: "roomId is required" }, { status: 400 });
        }

        if (action === "leave") {
            await prisma.roomParticipant.deleteMany({
                where: { roomId, userId: session.user.id },
            });
            return NextResponse.json({ success: true });
        }

        if (action === "heartbeat") {
            await prisma.roomParticipant.updateMany({
                where: { roomId, userId: session.user.id },
                data: { lastSeen: new Date() },
            });
            return NextResponse.json({ success: true });
        }

        // Default: join
        const existing = await prisma.roomParticipant.findUnique({
            where: { roomId_userId: { roomId, userId: session.user.id } },
        });

        if (existing) {
            await prisma.roomParticipant.update({
                where: { id: existing.id },
                data: { lastSeen: new Date() },
            });
        } else {
            await prisma.roomParticipant.create({
                data: { roomId, userId: session.user.id },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error managing participant:", error);
        return NextResponse.json({ error: "Failed to manage participant" }, { status: 500 });
    }
}
