import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE a room (owner only)
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const roomId = req.nextUrl.searchParams.get("roomId");
        if (!roomId) {
            return NextResponse.json({ error: "roomId is required" }, { status: 400 });
        }

        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }
        if (room.adminId !== session.user.id) {
            return NextResponse.json({ error: "Only the room owner can delete this room" }, { status: 403 });
        }

        await prisma.room.delete({ where: { id: roomId } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting room:", error);
        return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
    }
}
