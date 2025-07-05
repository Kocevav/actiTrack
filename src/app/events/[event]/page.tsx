"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Spinner from "@/components/ui/spiner";
import { StatusBadge } from "@/components/events/event/StatusBadge";
import { DetailItem } from "@/components/events/event/DetailItem";
import { StarRating } from "@/components/events/event/StarRating";

interface Comment {
  id: string;
  description: string;
  rating: number | null;
  owner: string;
  createdAt: string;
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Event not found");
    return res.json();
  });

export default function EventDetails() {
  const params = useParams();
  const event = params.event as string;
  const router = useRouter();
  const currentUserId = useSession().data?.userId ?? null;

  // SWR fetch for event details
  const { data, error, isLoading, mutate } = useSWR(
    event ? `/api/events/${event}` : null,
    fetcher
  );

  // UI states
  const [isJoining, setIsJoining] = useState(false);
  const [, setHasJoined] = useState(data?.event?.hasJoined ?? false);
  const [deleting, setDeleting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState<number | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>(
    data?.event?.comments ?? []
  );
  const [eventOwnerId, setEventOwnerId] = useState<string | null>(
    data?.event?.owner?.id ?? null
  );

  // Keep comments and ownerId in sync with SWR data
  useEffect(() => {
    if (data?.event) {
      setComments(data.event.comments || []);
      setHasJoined(data.event.hasJoined || false);
      setEventOwnerId(data.event.owner?.id || null);
    }
  }, [data]);

  // Join/Leave Event
  const handleJoinEvent = async () => {
    if (!event || isJoining) return;
    setIsJoining(true);
    try {
      const response = await fetch(`/api/events/${event}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join event");
      }
      setHasJoined(true);
      mutate();
    } catch (err) {
      alert("Failed to join event: " + err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!event || isJoining) return;
    setIsJoining(true);
    try {
      const response = await fetch(`/api/events/${event}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to leave event");
      }
      setHasJoined(false);
      mutate(); // revalidate event data
    } catch (err) {
      alert("Failed to leave event: " + err);
    } finally {
      setIsJoining(false);
    }
  };

  // Submit Comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !event || isSubmittingComment) return;
    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/events/${event}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: commentText.trim(),
          rating: commentRating,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add comment");
      }
      const resData = await response.json();
      setComments((prev) => [resData.comment, ...prev]);
      setCommentText("");
      setCommentRating(null);
      mutate(); // revalidate event data
    } catch (err) {
      alert("Failed to add comment: " + err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async () => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${event}`, { method: "DELETE" });
      const result = await res.json();
      if (res.ok && result.success) {
        router.push("/events");
      } else {
        alert("Failed to delete event: " + result.error);
      }
    } catch (e) {
      alert("Something went wrong while deleting the event." + e);
    }
  };

  // UI rendering
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
        <Spinner text="Loading event..." />
      </div>
    );
  }

  if (error || !data?.event) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
        <div className="relative z-10 text-center bg-neutral-900/80 border border-red-500/30 rounded-2xl px-8 py-10 shadow-2xl">
          <p className="text-2xl text-red-500 font-bold mb-3">
            {error?.message || "Event not found!"}
          </p>
          <Link
            href="/events"
            className="inline-block text-orange-400 hover:underline font-medium"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventData = {
    title: data.event.name,
    description: data.event.description,
    owner: data.event.owner?.name || "Unknown",
    ownerId: data.event.owner?.id || null,
    time: new Date(data.event.time).toLocaleString("en-GB"),
    place: data.event.place,
    participants: data.event.participants || 0,
    status: data.event.status,
    comments: data.event.comments || [],
    link: `/events/${event}`,
    hasJoined: data.event.hasJoined || false,
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
      {deleting && <Spinner text="Deleting event..." />}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 py-10 bg-neutral-900/90 border border-orange-400/10 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Event Info and Actions */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-orange-200 tracking-tight drop-shadow">
                {eventData.title}
              </h1>
              <StatusBadge status={eventData.status} />
            </div>
            <p className="text-lg text-zinc-300 mb-6">
              {eventData.description}
            </p>
            <div className="space-y-3 mb-8">
              <DetailItem icon="👤" label="Owner" value={eventData.owner} />
              <DetailItem icon="⏰" label="Time" value={eventData.time} />
              <DetailItem icon="📍" label="Place" value={eventData.place} />
              <DetailItem
                icon="👥"
                label="Participants"
                value={eventData.participants}
              />
            </div>
            {/* Join/Leave and Owner Actions */}

            <div className="flex flex-wrap gap-4 mb-8">
              {eventData.status != "FINISHED" && (
                <>
                  {eventData.hasJoined ? (
                    <button
                      onClick={handleLeaveEvent}
                      disabled={isJoining}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200 shadow-sm"
                    >
                      {isJoining ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "❌"
                      )}
                      {isJoining ? "Leaving..." : "Leave Event"}
                    </button>
                  ) : (
                    <button
                      onClick={handleJoinEvent}
                      disabled={isJoining}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200 shadow-sm"
                    >
                      {isJoining ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "🎉"
                      )}
                      {isJoining ? "Joining..." : "Join Event"}
                    </button>
                  )}
                </>
              )}

              {currentUserId &&
                eventOwnerId &&
                currentUserId === eventOwnerId && (
                  <>
                    <Link
                      href={`/events/${event}/edit`}
                      className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200 shadow-sm"
                    >
                      Edit Event
                    </Link>
                    <button
                      onClick={handleDeleteEvent}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200 shadow-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>

            <Link
              href="/events"
              className="inline-block text-orange-400 hover:underline font-semibold"
            >
              ← Back to Events
            </Link>
          </div>

          {/* Right: Comments and Add Comment */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Add Comment Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">
                Leave a comment
              </h2>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts about this event..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isSubmittingComment}
                  />
                </div>
                {eventData.status === "FINISHED" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rating (optional)
                    </label>
                    <StarRating
                      rating={commentRating}
                      setRating={setCommentRating}
                      disabled={isSubmittingComment}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {isSubmittingComment ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "💬"
                  )}
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                </button>
              </form>
            </div>
            {/* Comments Section */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-200">
                        {comment.owner}
                      </span>
                      <div className="flex items-center gap-2">
                        {comment.rating && (
                          <div className="flex">
                            {Array.from({ length: comment.rating }, (_, i) => (
                              <span key={i} className="text-yellow-400 text-sm">
                                ⭐
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="text-sm text-gray-400">
                          {new Date(comment.createdAt).toDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300">{comment.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[20vh] bg-orange-500/10 blur-3xl rounded-full pointer-events-none"
      ></div>
    </div>
  );
}
