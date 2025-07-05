import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const currentUserId = session?.userId;
  const { id: friendId } = params;

  if (!currentUserId || currentUserId === friendId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: friendId,
      },
    },
    update: {},
    create: { followerId: currentUserId, followingId: friendId },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const currentUserId = session?.userId;
  const { id: friendId } = params;

  if (!currentUserId || currentUserId === friendId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.follow.deleteMany({
    where: { followerId: currentUserId, followingId: friendId },
  });

  return NextResponse.json({ success: true });
}
