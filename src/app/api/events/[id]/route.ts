// /app/api/events/[id]/route.ts

import { requireAuth } from "@/lib/auth-helper";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = session.userId;
    const { id: eventId } = await params; // Await params before using

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        participants: {
          select: {
            userId: true
          }
        },
        comments: {
          include: {
            owner: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found!" }, { status: 404 });
    }

    // Check if the current user has joined the event
    const hasJoined = event.participants.some(p => p.userId === userId);

    const response = {
      id: event.id,
      name: event.name,
      description: event.description,
      owner: event.owner,
      time: event.time,
      place: event.place,
      participants: event.participants.length,
      status: event.status,
      hasJoined,
      comments: event.comments.map(comment => ({
        id: comment.id,
        description: comment.description,
        rating: comment.rating,
        owner: comment.owner.name,
        createdAt: comment.createdAt
      }))
    };

    return NextResponse.json({ event: response });
  } catch (error) {
    console.error("Error fetching event", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}