
import { requireAuth } from "@/lib/auth-helper";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = session.userId;
    const { id: eventId } = await params;
    
    const body = await req.json();
    const { description, rating } = body;

    if (!description || description.trim().length === 0) {
      return NextResponse.json({ error: "Comment description is required" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        description: description.trim(),
        rating: rating || null,
        eventId: eventId,
        ownerId: userId
      },
      include: {
        owner: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Comment added successfully",
      comment: {
        id: comment.id,
        description: comment.description,
        rating: comment.rating,
        owner: comment.owner.name,
        createdAt: comment.createdAt
      }
    });

  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}