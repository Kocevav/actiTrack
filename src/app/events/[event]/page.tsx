"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useEffect, useState } from "react";
import { EventItem } from "@/types/event";
import { useRouter } from "next/navigation";


interface Comment {
  id: string;
  description: string;
  rating: number | null;
  owner: string;
  createdAt: string;
}

export default function EventDetails() {
  const params = useParams();
  const event = params.event as string;
  const [eventData, setEventData] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const router = useRouter();

  
  // Comment form state
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState<number | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  // New states for current user and event owner IDs
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [eventOwnerId, setEventOwnerId] = useState<string | null>(null);

  // Fetch current logged-in user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error("Failed to get user session");
        const data = await res.json();
        setCurrentUserId(data.userId); // adjust 'userId' if your API uses a different key
      } catch (err) {
        console.error("Error fetching user session:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch event data and set event owner ID
  useEffect(() => {
    if (!event) return;
    
    fetch(`/api/events/${event}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Event not found');
        }
        return res.json();
      })
      .then(data => {
        const mappedEvent = {
          title: data.event.name,
          description: data.event.description,
          owner: data.event.owner?.name || "Unknown",
          time: new Date(data.event.time).toLocaleString("en-GB"),
          place: data.event.place,
          participants: data.event.participants || 0,
          status: data.event.status,
          comments: data.event.comments || [],
          link: `/events/${event}`,
        };
        setEventData(mappedEvent);
        setEventOwnerId(data.event.owner?.id || null);  // store owner ID here
        setComments(data.event.comments || []);
        setHasJoined(data.event.hasJoined || false);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [event]);

  const handleJoinEvent = async () => {
    if (!event || isJoining) return;

    setIsJoining(true);
    try {
      const response = await fetch(`/api/events/${event}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join event');
      }

      const data = await response.json();
      
      setEventData(prev => prev ? {
        ...prev,
        participants: data.participantCount
      } : null);
      setHasJoined(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join event');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!event || isJoining) return;

    setIsJoining(true);
    try {
      const response = await fetch(`/api/events/${event}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave event');
      }

      const data = await response.json();
      
      setEventData(prev => prev ? {
        ...prev,
        participants: data.participantCount
      } : null);
      setHasJoined(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave event');
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !event || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/events/${event}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: commentText.trim(),
          rating: commentRating
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      const data = await response.json();
      
      // Add new comment to the list
      setComments(prev => [data.comment, ...prev]);
      
      // Clear form
      setCommentText("");
      setCommentRating(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-neutral-950 flex items-center justify-center">
        <BackgroundBeams />
        <div className="relative z-10 text-center">
          <p className="text-xl text-gray-300">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="w-full min-h-screen bg-neutral-950 flex items-center justify-center">
        <BackgroundBeams />
        <div className="relative z-10 text-center">
          <p className="text-xl text-red-500 font-medium">
            {error || "Event not found!"}
          </p>
          <Link href="/events" className="mt-4 inline-block text-blue-400 hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }
  const handleDeleteEvent = async () => {
  const confirmed = confirm("Are you sure you want to delete this event?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/events/${event}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (res.ok && result.success) {
      alert("Event deleted successfully");
      router.push("/events");
    } else {
      alert("Failed to delete event: " + result.error);
    }
  } catch (err) {
    console.error("Delete failed", err);
    alert("Something went wrong while deleting the event.");
  }
};

  
  return (
    <div className="w-full min-h-screen bg-neutral-950 relative">
      <BackgroundBeams />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-100">{eventData.title}</h1>
        <p className="text-gray-300 mt-2">{eventData.description}</p>
        
        <div className="mt-5 space-y-2">
          <p className="text-gray-300"><strong>👤 Owner:</strong> {eventData.owner}</p>
          <p className="text-gray-300"><strong>⏰ Time:</strong> {eventData.time}</p>
          <p className="text-gray-300"><strong>📍 Place:</strong> {eventData.place}</p>
          <p className="text-gray-300"><strong>👥 Participants:</strong> {eventData.participants}</p>
          <p className="text-gray-300"><strong>📌 Status:</strong> {eventData.status}</p>
        </div>

        {/* Join/Leave Event Button */}
        <div className="mt-6">

          {/* Action Buttons: Join/Leave & Edit */}
          <div className="mt-6 flex flex-wrap gap-4">
            {hasJoined ? (
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

          {/* Conditionally render Edit and Delete buttons only if user is event owner */}
{currentUserId && eventOwnerId && currentUserId === eventOwnerId && (
  <div className="flex gap-4">
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
  </div>
)}

          </div>

        </div>
        
        {/* Add Comment Form */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Leave a comment </h2>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts about this event..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSubmittingComment}
              />
            </div>
            
            <div>
              
              {eventData.status === "FINISHED" && (
                <>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating (optional)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCommentRating(commentRating === star ? null : star)}
                        className={`text-2xl transition-colors ${
                          commentRating && star <= commentRating
                            ? 'text-yellow-400'
                            : 'text-gray-500 hover:text-yellow-300'
                        }`}
                        disabled={isSubmittingComment}
                      >
                        ⭐
                      </button>
                    ))}
                    {commentRating && (
                      <button
                        type="button"
                        onClick={() => setCommentRating(null)}
                        className="ml-2 text-sm text-gray-400 hover:text-gray-300"
                        disabled={isSubmittingComment}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </>
              )}

            </div>
            
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
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">💬 Comments ({comments.length})</h2>
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-200">{comment.owner}</span>
                    <div className="flex items-center gap-2">
                      {comment.rating && (
                        <div className="flex">
                          {Array.from({ length: comment.rating }, (_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">⭐</span>
                          ))}
                        </div>
                      )}
                      <span className="text-sm text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300">{comment.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
        
        <Link href="/events" className="mt-6 inline-block text-blue-400 hover:underline">
          ← Back to Events
        </Link>
      </div>
    </div>
  );
}
