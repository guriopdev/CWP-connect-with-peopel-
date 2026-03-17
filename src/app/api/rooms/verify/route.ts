import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST verify room password
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { roomId, password } = body;

        if (!roomId || !password) {
            return NextResponse.json({ error: "Missing roomId or password" }, { status: 400 });
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        if (!room.isLocked) {
            return NextResponse.json({ success: true });
        }

        if (room.password === password) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 403 });
        }
    } catch (error: any) {
        console.error("Error verifying password:", error);
        return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
    }
}
