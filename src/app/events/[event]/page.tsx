"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useEffect, useState } from "react";
import { EventItem } from "@/types/event";

export default function EventDetails() {
  const params = useParams();
  const event = params.event as string; // Get event ID from URL
  const [eventData, setEventData] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!event) return; // Don't fetch if no event ID
    
    fetch(`/api/events/${event}`) // Use backticks for template literal!
      .then(res => {
        if (!res.ok) {
          throw new Error('Event not found');
        }
        return res.json();
      })
      .then(data => {
        // Map API data to frontend format
        const mappedEvent = {
          title: data.event.name, // API uses 'name', frontend expects 'title'
          description: data.event.description,
          owner: data.event.owner?.name || "Unknown", // Extract name from owner object
          time: new Date(data.event.time).toLocaleString("en-GB"),
          place: data.event.place,
          participants: data.event.participants || 0,
          status: data.event.status,
          comments: data.event.comments || [],
          link: `/events/${event}`, // Add the required link property
        };
        setEventData(mappedEvent);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [event]); // Now `event` is properly defined!
  
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-neutral-950 flex items-center justify-center">
        <BackgroundBeams />
        <div className="relative z-10 text-center">
          <p className="text-xl text-gray-300">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="w-full min-h-screen bg-neutral-950 flex items-center justify-center">
        <BackgroundBeams />
        <div className="relative z-10 text-center">
          <p className="text-xl text-red-500 font-medium">
            {error || "Event not found!"}
          </p>
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