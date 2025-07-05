import { requireAuth } from "@/lib/auth-helper";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const userId = session.userId;
    const eventId = params.id;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found!" }, { status: 404 });
    }

    // Try to create participation (will fail if already exists due to unique constraint)
    try {
      await prisma.eventParticipation.create({
        data: { userId, eventId },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Unique constraint violation
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "Already joined this event!" },
          { status: 400 }
        );
      }
      throw err;
    }

    // Get updated participant count
    const participantCount = await prisma.eventParticipation.count({
      where: { eventId },
    });

    return NextResponse.json({
      message: "Successfully joined event!",
      participantCount,
    });
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
