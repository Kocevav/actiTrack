"use client";

import CreateEventForm from "@/app/events/create/createEventForm";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex">
      <main className="flex-1 flex items-center justify-center p-2 sm:p-6">
        <CreateEventForm />
      </main>
    </div>
  );
}
