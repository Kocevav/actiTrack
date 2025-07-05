"use client";
import React, { Suspense, useState } from "react";
import { FetchedEvents } from "../../components/ui/fetchedEvents";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spiner";
import { CreateEventButton } from "@/components/events/CreateEventButton";

export function EventsPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleHostClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/events/create");
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      {/* Overlay Spinner when loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <Spinner text="Preparing your event form…" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl mx-auto mt-12 mb-8 px-6 py-8 bg-neutral-900/80 rounded-2xl shadow-2xl border border-orange-400/10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Discover Inspiring Events
          </h1>
          <CreateEventButton onClick={handleHostClick} loading={loading} />
        </div>

        {/* Suspense for loading spinner */}
        <div className="w-full max-w-[900px] mx-auto mt-12 mb-8 px-4">
          <Suspense fallback={<Spinner />}>
            <FetchedEvents />
          </Suspense>
        </div>
      </div>
      {/* Decorative Glow */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[20vh] bg-orange-500/10 blur-3xl rounded-full pointer-events-none"
      />
    </div>
  );
}

export default EventsPage;
