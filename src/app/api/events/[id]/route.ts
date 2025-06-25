import { requireAuth } from "@/lib/auth-helper";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const eventId = params.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        owner: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found!" },
        { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.log("Error fetchinng event", error);
  }
}
