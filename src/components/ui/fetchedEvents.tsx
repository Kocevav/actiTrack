"use client";

import React, { useEffect, useState } from "react";
import { HoverEffect } from "./card-hover-effect";
import { EventItem } from "@/types/event";

const FetchedEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedEvents: EventItem[] = data.events.map((event: any) => ({
  title: event.name,
  description: event.description,
  owner: event.owner?.name || "Unknown",
  time: new Date(event.time).toLocaleString("en-GB"),
  place: event.place,
  participants: event.participants || 0,
  status: event.status,
  comments: event.comments || [],
  link: `/events/${event.id}`,
}));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full max-w-5xl px-8 mx-auto mt-4">
        <HoverEffect items={events} />
    </div>
  );
};

export default FetchedEvents;
