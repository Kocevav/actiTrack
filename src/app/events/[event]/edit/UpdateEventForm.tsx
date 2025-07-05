"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter, useParams } from "next/navigation";
import Spinner from "@/components/ui/spiner";

export default function UpdateEventForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [status, setStatus] = useState<"CREATED" | "FINISHED">("CREATED");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const router = useRouter();
  const params = useParams();
  const eventId = params.event as string;

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();

        setName(data.event.name);
        setDescription(data.event.description);
        setLocation(data.event.place);
        setDateTime(new Date(data.event.time));
        setStatus(data.event.status); // Set status from fetched data
        setLoading(false);
      } catch (err) {
        console.error("Failed to load event:", err);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm) return;
    setUpdating(true);

    const res = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        place: location,
        time: dateTime,
        status,
      }),
    });
    setUpdating(false);

    const result = await res.json();

    if (res.ok && result.success) {
      router.push(`/events/${eventId}`);
    } else {
      alert("Error updating event: " + result.error);
    }
  };

  if (loading) return <Spinner text="Loading..." />;
  if (updating) return <Spinner text="Updating..." />;

  return (
    <form
      onSubmit={handleUpdate}
      className="bg-black border border-neutral-800 p-6 rounded-2xl shadow-md w-full max-w-xl space-y-5"
    >
      <h2 className="text-white text-2xl font-semibold mb-2">Update Event</h2>

      <input
        type="text"
        placeholder="Event name"
        className="w-full p-2 rounded-md bg-neutral-900 text-white border border-neutral-700"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="w-full p-2 rounded-md bg-neutral-900 text-white border border-neutral-700"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        className="w-full p-2 rounded-md bg-neutral-900 text-white border border-neutral-700"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <div>
        <label className="text-white mb-1 block">Date & Time</label>
        <DatePicker
          selected={dateTime}
          onChange={(date) => setDateTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="Pp"
          placeholderText="Select date and time"
          className="w-full"
        />
      </div>

      {/* Status select input */}
      <div>
        <label className="text-white mb-1 block">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "CREATED" | "FINISHED")}
          className="w-full p-2 rounded-md bg-neutral-900 text-white border border-neutral-700"
        >
          <option value="CREATED">Created</option>
          <option value="FINISHED">Finished</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-2 rounded-md font-medium"
      >
        Update Event
      </button>
    </form>
  );
}
