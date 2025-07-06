import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const followers = await prisma.follow.findMany({
    where: { followingId: id },
    select: {
      follower: { select: { id: true, name: true, image: true, email: true } },
    },
  });
  return NextResponse.json({
    users: followers.map((f) => f.follower),
  });
}
