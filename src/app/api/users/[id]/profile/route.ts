import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";
import { getUserWithStats } from "@/utils/user-queries.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const currentUserId = session?.userId;

  if (!id) {
    return NextResponse.json({ error: "No user id" }, { status: 400 });
  }

  const userWithStats = await getUserWithStats(id);

  if (!userWithStats) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Is current user following this user?
  let isFollowing = false;
  if (currentUserId && currentUserId !== id) {
    const follow = await prisma.follow.findFirst({
      where: { followerId: currentUserId, followingId: id },
    });
    isFollowing = !!follow;
  }

  return NextResponse.json({
    user: userWithStats.user,
    stats: userWithStats.stats,
    isFollowing,
    isMe: currentUserId === id,
  });
}
