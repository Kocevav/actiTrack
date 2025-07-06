"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spiner";
import { EventFormInput } from "@/components/events/create/EventFormInput";
import { EventFormDatePicker } from "@/components/events/create/EventFormDatePicker";

export default function CreateEventForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !location || !dateTime) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
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
      if (res.ok && result.success) {
        router.push("/events");
      } else {
        alert("Error creating event: " + result.error);
      }
    } catch (error) {
      alert("An error occurred. Please try again." + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <Spinner text="Creating your event..." />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto px-3 sm:px-8 py-8 sm:py-10 bg-neutral-900/90 rounded-2xl shadow-2xl border border-neutral-800 space-y-7 mt-8 mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center tracking-tight drop-shadow-lg">
          Host Your Own Event
        </h2>
        <p className="text-neutral-300 text-center mb-6 text-sm sm:text-base">
          Share your idea, gather your community, and make something
          unforgettable!
        </p>

        <EventFormInput
          label="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a catchy event name"
          required
          disabled={loading}
        />

        <EventFormInput
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this event about?"
          required
          disabled={loading}
          textarea
        />

        <EventFormInput
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where will it happen?"
          required
          disabled={loading}
        />

        <EventFormDatePicker
          label="Date & Time"
          value={dateTime}
          onChange={setDateTime}
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{"Let's Make It Happen!"}</span>
            </>
          )}
        </button>
      </form>
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[60vw] h-[16vh] bg-orange-500/10 blur-3xl rounded-full pointer-events-none"
      ></div>
    </div>
  );
}
