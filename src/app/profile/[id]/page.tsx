"use client";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Spinner from "@/components/ui/spiner";
import DefaultAvatar from "@/components/ui/DefaultAvatar";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import UserSearchResults from "@/components/ui/UserSearchResults";
import UserPopover from "@/components/ui/UserPopover";

export default function ProfileSection() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;
  const id = params?.id ?? currentUserId;

  // Search state
  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [searching, setSearching] = useState(false);

  // Only fetch if we have an id
  const { data, isLoading, mutate } = useSWR(
    id ? `/api/users/${id}/profile` : null,
    (url) => fetch(url).then((r) => r.json())
  );
  const [actionLoading, setActionLoading] = useState(false);

  // If /profile and not logged in, redirect to login or show not signed in
  useEffect(() => {
    if (!params?.id && status === "authenticated" && !currentUserId) {
      router.push("/api/auth/signin");
    }
  }, [params, status, currentUserId, router]);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearching(true);
    setSearchResults([]);
    if (!query) {
      setSearching(false);
      return;
    }
    const res = await fetch(
      `/api/users/search?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setSearchResults(data.users || []);
    setSearching(false);
  };

  // Handle clicking a user in search results
  const handleSelectUser = (userId: string) => {
    setSearchResults([]);
    router.push(`/profile/${userId}`);
  };

  const handleFollow = async () => {
    setActionLoading(true);
    await fetch(`/api/users/${id}/follow`, { method: "POST" });
    mutate();
    setActionLoading(false);
  };
  const handleUnfollow = async () => {
    setActionLoading(true);
    await fetch(`/api/users/${id}/follow`, { method: "DELETE" });
    mutate();
    setActionLoading(false);
  };

  return (
    <div
      className="
      relative min-h-screen flex flex-col items-center justify-start pt-10
      
      overflow-x-hidden
    "
    >
      {/* Search Bar & Results */}
      <div className="w-full max-w-lg mx-auto z-10">
        <SearchBar onSearch={handleSearch} />
        {searching ? (
          <div className="text-center text-orange-300 mt-4">Searching...</div>
        ) : (
          <UserSearchResults
            users={searchResults}
            onSelect={handleSelectUser}
          />
        )}
      </div>

      {/* Profile Card */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
        {isLoading || status === "loading" ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner text="Loading profile..." />
          </div>
        ) : !data?.user ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-red-500 text-xl">User not found.</div>
          </div>
        ) : (
          <div className="relative w-full max-w-lg mx-auto px-8 py-12 mt-8 bg-neutral-900/90 rounded-3xl shadow-2xl border border-orange-400/10 backdrop-blur-md">
            <button
              onClick={() => router.back()}
              className="absolute top-4 right-4 flex items-center gap-1 text-orange-400 hover:text-orange-200 font-semibold text-sm px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-orange-500/10 transition"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {data.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.user.image}
                    alt={data.user.name || "User"}
                    className="w-28 h-28 rounded-full border-4 border-orange-500 shadow-lg object-cover"
                  />
                ) : (
                  <DefaultAvatar size={112} />
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-orange-200 tracking-tight drop-shadow-lg">
                {data.user.name || "User"}
              </h1>
              <p className="text-neutral-300 mb-4">{data.user.email}</p>
              <div className="flex flex-wrap gap-6 my-4 justify-center">
                <ProfileStat
                  label="Events Hosted"
                  value={data.stats?.ownedEvents ?? 0}
                />
                <ProfileStat
                  label="Events Joined"
                  value={data.stats?.eventParticipation ?? 0}
                />
                <ProfileStat
                  label="Comments"
                  value={data.stats?.comments ?? 0}
                />
                <UserPopover userId={data.user.id} type="followers">
                  <ProfileStat
                    label="Followers"
                    value={data.stats?.followedBy ?? 0}
                  />
                </UserPopover>
                <UserPopover userId={data.user.id} type="following">
                  <ProfileStat
                    label="Following"
                    value={data.stats?.following ?? 0}
                  />
                </UserPopover>
              </div>
              {data.isMe ? (
                <button className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  Edit Profile
                </button>
              ) : (
                <button
                  className={`mt-4 px-6 py-2 ${
                    data.isFollowing
                      ? "bg-gradient-to-r from-orange-700 to-orange-500 hover:from-orange-800 hover:to-orange-600"
                      : "bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800"
                  } text-white font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                  onClick={data.isFollowing ? handleUnfollow : handleFollow}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "..."
                    : data.isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center min-w-[90px] cursor-pointer">
      <div className="text-2xl font-bold text-orange-400">{value}</div>
      <div className="text-xs text-neutral-400">{label}</div>
    </div>
  );
}
