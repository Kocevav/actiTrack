// /app/api/events/[id]/join/route.ts

import { requireAuth } from "@/lib/auth-helper";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = session.userId;
    const { id: eventId } = await params; // Await params before using

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found!" }, { status: 404 });
    }

    const existingParticipant = event.participants.find(p => p.userId === userId);
    
    if (existingParticipant) {
      return NextResponse.json({ error: "Already joined this event!" }, { status: 400 });
    }

    await prisma.eventParticipation.create({
      data: {
        userId: userId,
        eventId: eventId
      }
    });

    // Get updated participant count
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: true
      }
    });

    return NextResponse.json({
      message: "Successfully joined event!",
      participantCount: updatedEvent?.participants.length || 0
    });
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}