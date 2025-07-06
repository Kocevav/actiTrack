import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const events = await prisma.event.findMany({
    where: { ownerId: id },
    select: { time: true },
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const eventCounts = Array(12).fill(0);
  events.forEach((event) => {
    const date = new Date(event.time);
    eventCounts[date.getMonth()] += 1;
  });

  const data = months.map((month, idx) => ({
    month,
    hosted: eventCounts[idx],
  }));

  return NextResponse.json({ data });
}
