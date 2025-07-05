import UpdateEventForm from "@/app/events/[event]/edit/UpdateEventForm";

export default function EditEventPage() {
  return (
    <div className="w-full min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <UpdateEventForm />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[20vh] bg-orange-500/10 blur-3xl rounded-full pointer-events-none"
      ></div>
    </div>
  );
}
