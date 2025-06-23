import getServerSession from "next-auth";
import { auth } from "@/auth"; // провери дали кај тебе е на друга локација
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";


export async function POST(req: Request) {
  try {
    const session = await auth(); // 2. Добиј ја сесијата

    if (!session?.user?.name) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      time,
      place,
      participants,
      status,
      comments,
    } = body;

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        owner: session.user.name, // 3. Користи го логираниот user
        time: new Date(time),
        place,
        participants,
        status,
        comments,
      },
    });

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}



export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { time: "asc" },
    });

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
