import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  const userId = params.id;
  const activities = await prisma.activity.findMany({
    where: { ownerId: userId },
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ activities });
}
