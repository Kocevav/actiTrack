// app/api/events/popular-of-day/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const events = await prisma.event.findMany({
    where: {
      comments: {
        some: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      comments: {
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        select: { id: true },
      },
    },
  });

  const data = events
    .map((event) => ({
      name: event.name,
      value: event.comments.length,
    }))
    .sort((a, b) => b.value - a.value);

  return NextResponse.json({ data });
}
