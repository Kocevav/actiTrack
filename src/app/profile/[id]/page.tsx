"use client";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/ui/spiner";
import DefaultAvatar from "@/components/ui/DefaultAvatar";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import UserSearchResults from "@/components/ui/UserSearchResults";
import UserPopover from "@/components/ui/UserPopover";
import { EventsHostedByMonthChart } from "@/components/ui/EventsHostedByMonthChart";
import polyline from "@mapbox/polyline";
import ActivityMap from "@/components/ui/ActivityMap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfileSection() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [searching, setSearching] = useState(false);

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const [activityIdInput, setActivityIdInput] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [fromDate, toDate] = dateRange;

  // Load profile data (including isStrava)
  const fetchProfile = async () => {
    if (!id) return;
    setIsLoading(true);
    const r = await fetch(`/api/users/${id}/profile`);
    const d = await r.json();
    setData(d);
    setIsFollowing(d.isFollowing ?? false);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setActivitiesLoading(true);
    fetch(`/api/activities/user/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setActivities(d.activities || []);
        setActivitiesLoading(false);
      });
  }, [id]);

  const handleSaveActivity = async () => {
    if (!activityIdInput) return;
    setSaveLoading(true);
    setSaveMessage(null);
    const res = await fetch("/api/activities/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId: activityIdInput }),
    });
    const data = await res.json();
    setSaveLoading(false);
    setSaveMessage(
      data.success ? "Activity saved!" : data.error || "Failed to save."
    );
    if (data.success) {
      setActivitiesLoading(true);
      fetch(`/api/activities/user/${id}`)
        .then((r) => r.json())
        .then((d) => {
          setActivities(d.activities || []);
          setActivitiesLoading(false);
        });
      setActivityIdInput("");
    }
  };

  const handleFollow = async () => {
    setActionLoading(true);
    await fetch(`/api/users/${id}/follow`, { method: "POST" });
    setIsFollowing(true);
    setData((prev: any) => ({
      ...prev,
      stats: {
        ...prev.stats,
        followedBy: (prev.stats?.followedBy ?? 0) + 1,
      },
    }));
    setActionLoading(false);
  };
  const handleUnfollow = async () => {
    setActionLoading(true);
    await fetch(`/api/users/${id}/follow`, { method: "DELETE" });
    setIsFollowing(false);
    setData((prev: any) => ({
      ...prev,
      stats: {
        ...prev.stats,
        followedBy: Math.max((prev.stats?.followedBy ?? 1) - 1, 0),
      },
    }));
    setActionLoading(false);
  };

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

  const handleSelectUser = (userId: string) => {
    setSearchResults([]);
    router.push(`/profile/${userId}`);
  };

  const sectionLoading = isLoading;

  const filteredActivities = activities.filter((a) => {
    if (!fromDate && !toDate) return true;
    if (!a.date) return false;
    const activityDate = new Date(a.date);
    if (fromDate && activityDate < fromDate) return false;
    if (toDate && activityDate > toDate) return false;
    return true;
  });

  const positionsList =
    filteredActivities
      .filter((a) => a.polyline)
      .map((a) =>
        polyline.decode(a.polyline).map(([lat, lng]) => ({ lat, lng }))
      ) || [];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-10 overflow-x-hidden">
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

      {sectionLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <Spinner text="Loading profile..." />
        </div>
      )}

      {/* Main Responsive Row */}
      <div
        className={`relative z-10 flex flex-col md:flex-row items-start justify-center w-full gap-8 px-4 mt-8 ${
          sectionLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {/* Left: Profile Card */}
        <div className="w-full max-w-lg mx-auto px-8 py-12 bg-neutral-900/90 rounded-3xl shadow-2xl border border-orange-400/10 backdrop-blur-md mb-8 md:mb-0">
          {!data?.user && !sectionLoading ? (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="text-red-500 text-xl">User not found.</div>
            </div>
          ) : (
            data?.user && (
              <>
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
                        isFollowing
                          ? "bg-gradient-to-r from-orange-700 to-orange-500 hover:from-orange-800 hover:to-orange-600"
                          : "bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800"
                      } text-white font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                      onClick={isFollowing ? handleUnfollow : handleFollow}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? "..."
                        : isFollowing
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  )}
                </div>
              </>
            )
          )}
        </div>

        <div className="w-full md:max-w-xl flex flex-col gap-8">
          {/* Stat Chart */}
          {id && <EventsHostedByMonthChart userId={id} />}

          {/* Activity Map Section (only for Strava users) */}
          {data?.user?.isStrava ? (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-xl font-bold text-orange-200 mt-2 mb-2">
                My Activity Map
              </h3>
              {/* Date filter */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-orange-200 font-semibold">
                  Filter by date:
                </span>
                <DatePicker
                  selectsRange
                  startDate={fromDate}
                  endDate={toDate}
                  onChange={(update: [Date | null, Date | null]) =>
                    setDateRange(update)
                  }
                  isClearable
                  placeholderText="Select date range"
                  className="px-2 py-1 rounded bg-neutral-800 text-orange-200"
                />
              </div>
              {/* Input to add new activity */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveActivity();
                }}
                className="flex flex-col sm:flex-row items-center gap-2 mb-4"
              >
                <input
                  type="text"
                  placeholder="Enter Strava Activity ID"
                  value={activityIdInput}
                  onChange={(e) => setActivityIdInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 border border-orange-400/30 text-orange-200 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold shadow transition"
                  disabled={!activityIdInput || saveLoading}
                >
                  {saveLoading ? "Saving..." : "Add Activity"}
                </button>
              </form>
              {saveMessage && (
                <div className="mb-4 text-orange-300">{saveMessage}</div>
              )}

              {/* Map */}
              {activitiesLoading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <span className="text-orange-300">Loading map...</span>
                </div>
              ) : (
                <ActivityMap positionsList={positionsList} />
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center bg-neutral-900/80 rounded-2xl border border-orange-400/10 p-8 text-center text-orange-300 shadow-lg mt-6">
              <span className="text-lg font-semibold">
                The map feature is available only on Strava accounts.
              </span>
            </div>
          )}
        </div>
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
