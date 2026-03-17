import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all rooms
export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            include: {
                admin: {
                    select: { name: true, username: true },
                },
                _count: {
                    select: { participants: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const formatted = rooms.map((room) => ({
            id: room.id,
            name: room.name,
            subject: room.subject,
            isLocked: room.isLocked,
            admin: room.admin.username || room.admin.name || "Unknown",
            users: room._count.participants,
            createdAt: room.createdAt,
        }));

        return NextResponse.json(formatted);
    } catch (error: any) {
        console.error("Error fetching rooms:", error);
        return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
    }
}

// POST create a new room
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, subject, isLocked, password } = body;

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Room name is required" }, { status: 400 });
        }

        const room = await prisma.room.create({
            data: {
                name: name.trim(),
                subject: subject || "General",
                isLocked: isLocked || false,
                password: isLocked ? password : null,
                adminId: session.user.id,
            },
            include: {
                admin: {
                    select: { name: true, username: true },
                },
            },
        });

        return NextResponse.json({
            id: room.id,
            name: room.name,
            subject: room.subject,
            isLocked: room.isLocked,
            admin: room.admin.username || room.admin.name || "You",
            users: 1,
            createdAt: room.createdAt,
        });
    } catch (error: any) {
        console.error("Error creating room:", error);
        return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
    }
}
