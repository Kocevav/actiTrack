import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // adjust this import to your setup

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const activityId = params.id;
  const res = await fetch(
    `https://www.strava.com/api/v3/activities/${activityId}`,
    {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
  const activity = await res.json();
  return NextResponse.json({
    summary_polyline: activity.map?.summary_polyline || "",
  });
}
