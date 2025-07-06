/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import useSWR from "swr";
import Spinner from "@/components/ui/spiner";
import { useSession } from "next-auth/react";

export function ArchivedEvents() {
  const { data: session } = useSession();
  const userId = session?.userId;

  const { data, error, isLoading } = useSWR(
    userId ? `/api/events?status=ARCHIVED&ownerId=${userId}` : null,
    (url) => fetch(url).then((res) => res.json())
  );

  if (!userId) return null;
  if (isLoading) return <Spinner />;
  if (error)
    return <div className="text-red-500">Failed to load archived events.</div>;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-orange-300 mb-4">
        Archived Events
      </h2>
      {data?.events?.length > 0 ? (
        <div className="space-y-4">
          {data.events.map((event: any) => (
            <div
              key={event.id}
              className="bg-neutral-800 p-4 rounded-xl border border-neutral-700"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange-200">{event.title}</span>
                <span className="text-xs uppercase px-2 py-1 rounded bg-yellow-800/40 text-yellow-200">
                  {event.status}
                </span>
              </div>
              <div className="text-neutral-300">{event.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8">
          No archived events.
        </div>
      )}
    </div>
  );
}
