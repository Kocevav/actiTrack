"use client";

import React, { useEffect, useState } from "react";
import { HoverEffect } from "./card-hover-effect";
import { EventItem } from "@/types/event";

const PAGE_SIZE = 4;

export const FetchedEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      const status = showArchived ? "ARCHIVED" : "CREATED,FINISHED";
      try {
        const res = await fetch(
          `/api/events?page=${page}&limit=${PAGE_SIZE}&status=${status}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );
        const data = await res.json();
        if (data && Array.isArray(data.events)) {
          const total = typeof data.total === "number" ? data.total : 0;
          const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
          setEvents(data.events);
          setTotalPages(totalPages);
        } else {
          setEvents([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, showArchived]);

  // Reset to page 1 if events are empty on a page > 1
  useEffect(() => {
    if (!loading && events.length === 0 && page > 1) {
      setPage(1);
    }
  }, [events, loading, page]);

  return (
    <div className="w-full max-w-6xl px-4 md:px-8 mx-auto mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-200">
          {showArchived ? "Archived Events" : "Active & Finished Events"}
        </h2>
        <button
          onClick={() => {
            setShowArchived((prev) => !prev);
            setPage(1); // reset to first page on toggle
          }}
          className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition"
        >
          {showArchived ? "Back to Active Events" : "Show Archived Events"}
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <svg
            className="animate-spin h-10 w-10 text-orange-500"
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
          <span className="ml-4 text-lg text-orange-200 font-semibold">
            Loading events...
          </span>
        </div>
      ) : (
        <>
          <HoverEffect items={events} />
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-orange-600 transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-orange-200 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages <= 1 || loading}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-orange-600 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
