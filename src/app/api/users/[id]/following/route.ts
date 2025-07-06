import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const following = await prisma.follow.findMany({
    where: { followerId: id },
    select: {
      following: { select: { id: true, name: true, image: true, email: true } },
    },
  });
  return NextResponse.json({
    users: following.map((f) => f.following),
  });
}
