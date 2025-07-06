"use client";
import React, { Suspense, useState } from "react";
import { FetchedEvents } from "../../components/ui/fetchedEvents";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spiner";
import { CreateEventButton } from "@/components/events/CreateEventButton";
import { PopularEventPieChart } from "@/components/ui/PopularEventPieChart";
import { Modal } from "@/components/ui/Modal";

export function EventsPage() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleHostClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/events/create");
    }, 100);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black relative">
      {/* Overlay Spinner when loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <Spinner text="Preparing your event form…" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl mx-auto mt-8 mb-8 px-2 sm:px-4 py-6 sm:py-8 bg-neutral-900/80 rounded-2xl shadow-2xl border border-orange-400/10">
        {/* Title and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg text-center sm:text-left w-full">
            Discover Inspiring Events
          </h1>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end mt-4 sm:mt-0">
            <CreateEventButton onClick={handleHostClick} loading={loading} />
          </div>
        </div>
        {/* Events List */}
        <div className="w-full max-w-[900px] mx-auto mt-8 mb-8 px-0 sm:px-4">
          <Suspense fallback={<Spinner />}>
            <FetchedEvents />
          </Suspense>
        </div>
        {/* Show Most Popular Events Button */}
        <div className="flex justify-center w-full mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 w-full sm:w-auto"
          >
            Show Most Popular Events
          </button>
        </div>
      </div>

      {/* Modal Popout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <PopularEventPieChart />
      </Modal>

      {/* Decorative Glow */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[60vw] h-[20vh] bg-orange-500/10 blur-3xl rounded-full pointer-events-none"
      />
    </div>
  );
}

export default EventsPage;
