import UpdateEventForm from "@/app/events/[event]/edit/UpdateEventForm";

export default function EditEventPage() {
  return (
    <div className="w-full min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <UpdateEventForm />
    </div>
  );
}
