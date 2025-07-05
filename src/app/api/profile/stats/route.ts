import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch counts
  const [
    ownedEvents,
    eventParticipation,
    comments,
    followedBy,
    following,
    activities,
  ] = await Promise.all([
    prisma.event.count({ where: { ownerId: userId } }),
    prisma.eventParticipation.count({ where: { userId } }),
    prisma.comment.count({ where: { ownerId: userId } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
    prisma.activity.count({ where: { ownerId: userId } }),
  ]);

  return NextResponse.json({
    ownedEvents,
    eventParticipation,
    comments,
    followedBy,
    following,
    activities,
  });
}
