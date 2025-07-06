import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { activityId } = await req.json();

  const stravaRes = await fetch(
    `https://www.strava.com/api/v3/activities/${activityId}`,
    {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }
  );
  if (!stravaRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
  const activity = await stravaRes.json();

  try {
    await prisma.activity.create({
      data: {
        id: activity.id.toString(),
        ownerId: session.userId,
        type: activity.type,
        duration: activity.elapsed_time,
        distance: activity.distance,
        date: new Date(activity.start_date),
        polyline: activity.map?.summary_polyline || null,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save to database" },
      { status: 500 }
    );
  }
}
