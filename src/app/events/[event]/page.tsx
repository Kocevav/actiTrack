"use client";

import { useParams } from "next/navigation";
import { events } from "@/components/ui/card";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function EventDetails() {
  const params = useParams();
  const event = params.event as string; // Get event slug from URL params
  
  console.log("Event param from URL:", event);
  
  // Find event data based on URL
  const eventData = events.find((e) => e.link.endsWith(`/${event}`));
  
  if (!eventData) {
    return (
      <div className="w-full min-h-screen bg-neutral-950 flex items-center justify-center">
        <BackgroundBeams />
        <div className="relative z-10 text-center">
          <p className="text-xl text-red-500 font-medium">Event not found!</p>
          <Link href="/events" className="mt-4 inline-block text-blue-400 hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-neutral-950 relative">
      <BackgroundBeams />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-100">{eventData.title}</h1>
        <p className="text-gray-300 mt-2">{eventData.description}</p>
        
        <div className="mt-5 space-y-2">
          <p className="text-gray-300"><strong>👤 Owner:</strong> {eventData.owner}</p>
          <p className="text-gray-300"><strong>⏰ Time:</strong> {eventData.time}</p>
          <p className="text-gray-300"><strong>📍 Place:</strong> {eventData.place}</p>
          <p className="text-gray-300"><strong>👥 Participants:</strong> {eventData.participants}</p>
          <p className="text-gray-300"><strong>📌 Status:</strong> {eventData.status}</p>
        </div>
        
        {/* Comments Section */}
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-200">💬 Comments</h2>
          <ul className="mt-2 text-gray-300">
            {eventData.comments.length > 0 ? (
              eventData.comments.map((comment, i) => <li key={i} className="py-1">• {comment}</li>)
            ) : (
              <li>No comments yet.</li>
            )}
          </ul>
        </div>
        
        <Link href="/events" className="mt-6 inline-block text-blue-400 hover:underline">
          ← Back to Events
        </Link>
      </div>
    </div>
  );
}