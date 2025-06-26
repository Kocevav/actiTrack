import { requireAuth } from "@/lib/auth-helper";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
        const { id: eventId } = await params;

  const session = await requireAuth();
    const userId = session.userId;

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const existingParticipation = await prisma.eventParticipation.findUnique({
      where: {
        event_user_unique: {
          eventId: eventId,
          userId: userId
        }
      }
    });

    if (!existingParticipation) {
      return NextResponse.json({ error: 'Not a participant of this event' }, { status: 400 });
    }

    // Remove user from participants
    await prisma.eventParticipation.delete({
      where: {
        event_user_unique: {
          eventId: eventId,
          userId: userId
        }
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
      message: 'Successfully left event',
      participantCount: updatedEvent?.participants.length || 0
    });

  } catch (error) {
    console.error('Error leaving event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}