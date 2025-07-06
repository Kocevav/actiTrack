import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    take: 10,
  });

  return NextResponse.json({ users });
}
