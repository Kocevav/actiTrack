import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const currentUserId = session?.userId;
  const { id } = params;

  if (!id) return NextResponse.json({ error: "No user id" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Stats
  const [ownedEvents, eventParticipation, comments, followedBy, following] =
    await Promise.all([
      prisma.event.count({ where: { ownerId: id } }),
      prisma.eventParticipation.count({ where: { userId: id } }),
      prisma.comment.count({ where: { ownerId: id } }),
      prisma.follow.count({ where: { followingId: id } }),
      prisma.follow.count({ where: { followerId: id } }),
    ]);

  // Is current user following this user?
  let isFollowing = false;
  if (currentUserId && currentUserId !== id) {
    const follow = await prisma.follow.findFirst({
      where: { followerId: currentUserId, followingId: id },
    });
    isFollowing = !!follow;
  }

  return NextResponse.json({
    user,
    stats: { ownedEvents, eventParticipation, comments, followedBy, following },
    isFollowing,
    isMe: currentUserId === id,
  });
}
