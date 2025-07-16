import { auth } from "@/auth"; // your auth helper
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserWithStats } from "@/utils/user-queries.util";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ message: "Not authenticated", success: false }, { status: 401 });
    }

    const userId = session.userId;

    const userWithStats = await getUserWithStats(userId);

    if (!userWithStats) {
      return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
    }

    let userContext = `User info:
- Name: ${userWithStats.user.name || "Unknown"}
- Total events hosted: ${userWithStats.stats.ownedEvents}
- Total events participated: ${userWithStats.stats.eventParticipation}
- Followers: ${userWithStats.stats.followedBy}
- Following: ${userWithStats.stats.following}

`;

    const activities = userWithStats.stats.activities || [];

    if (activities.length > 0) {
      const topActivities = activities.slice(0, 5);
      const activitySummary = topActivities
        .map(
          (a, i) =>
            `${i + 1}. Type: ${a.type}, Distance: ${a.distance} km, Duration: ${a.duration} min, Date: ${
              a.date ? new Date(a.date).toLocaleDateString() : "No date"
            }`
        )
        .join("\n");

      userContext += `Recent activities:
${activitySummary}

`;
    } else {
      userContext += "No recent activities found.\n\n";
    }

    const body = await req.json();
    const { message } = body;

    const lowerMessage = message.toLowerCase();
    const isPersonalQuestion = [
      "my activity",
      "my run",
      "my walk",
      "my ride",
      "last activities",
      "my recent activities",
      "compare",
      "my last activity",
    ].some((keyword) => lowerMessage.includes(keyword));

    const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    let systemPrompt = "";
    if (isPersonalQuestion && userContext) {
      systemPrompt = `You are a helpful assistant specialized in user activity insights. Use the user data below to answer questions clearly and concisely.

${userContext}
`;
    } else {
      systemPrompt = `You are a helpful assistant specialized in fitness and sports activities. Answer the user's question clearly and concisely, without user-specific data.

`;
    }

    const prompt = `${systemPrompt}\nUser: ${message}`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    return NextResponse.json({ message: aiResponse, success: true });
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return NextResponse.json({ message: "Failed to generate response.", success: false });
  }
}
