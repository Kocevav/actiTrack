import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { db } from "@/db";
import { requireAuth } from "@/lib/auth-helper";

export async function POST(req: Request) {

  
  try {
    const session = await requireAuth();

    const user = await db.user.findFirst({ where: { id: session.userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    console.log(body);
    const { name, description, time, place } = body;

    if (!name || !description || !time || !place) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        name,
        description,
        owner: {
          connect: { id: session.userId }, 
        },
        time: new Date(time),
        place,
        status: "CREATED",
      },
    });

    return NextResponse.json(
      { success: true, event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { time: "asc" },
      include: {
        owner: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    const formattedEvents = events.map((event) => ({
      ...event,
      participants: event._count.participants,
    }));

    return NextResponse.json({ success: true, events: formattedEvents });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
