import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;

    const user = await db.user.findFirst({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, description, time, place } = body;

    if (!name || !description || !time || !place) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (new Date(time) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Time must be in present!" },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        name,
        description,
        owner: {
          connect: { id: userId },
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 4;
    const skip = (page - 1) * limit;

    // Parse status filter (status=CREATED,FINISHED)
    const statusParam = searchParams.get("status");
    const status = statusParam ? statusParam.split(",") : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status) where.status = { in: status };

    // Total count for pagination (with filters)
    const total = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      orderBy: { time: "asc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        time: true,
        place: true,
        status: true,
        owner: { select: { name: true } },
        participants: { select: { id: true } },
        _count: { select: { comments: true } },
      },
    });

    const mappedEvents = events.map((event) => ({
      id: event.id,
      title: event.name,
      description: event.description,
      owner: event.owner?.name ?? "Unknown",
      time: new Date(event.time).toLocaleString("en-GB"),
      place: event.place,
      participants: event.participants.length,
      status: event.status,
      commentsCount: event._count.comments,
      link: `/events/${event.id}`,
    }));

    return NextResponse.json({
      success: true,
      events: mappedEvents,
      total,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
