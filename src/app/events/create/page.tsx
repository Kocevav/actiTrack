"use client";

import CreateEventForm from "@/app/events/create/createEventForm";

export default function CreateEventPage() {
  return (
    <div className="w-full min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <CreateEventForm />
    </div>
  );
}
