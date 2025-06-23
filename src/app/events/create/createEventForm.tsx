"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

export default function CreateEventForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    alert("Are you sure you want to create this event");
    console.log("PRAKJANJE request to /api/events");

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        place: location,
        time: dateTime,
      }),
    });

    const result = await res.json();
    console.log("Response:", result);

    if (res.ok && result.success) {
      router.push("/events");
    } else {
      alert("Error creating event: " + result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black border border-neutral-800 p-6 rounded-2xl shadow-md w-full max-w-xl space-y-5"
    >
      <h2 className="text-white text-2xl font-semibold mb-2">
        Create New Event
      </h2>

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

      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 transition duration-200 text-white py-2 rounded-md font-medium"
      >
        Create Event
      </button>
    </form>
  );
}
