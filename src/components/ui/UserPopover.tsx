/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import Link from "next/link";
import DefaultAvatar from "@/components/ui/DefaultAvatar";

export default function UserPopover({
  userId,
  type, // "followers" | "following"
  children,
}: {
  userId: string;
  type: "followers" | "following";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const endpoint =
    type === "followers"
      ? `/api/users/${userId}/followers`
      : `/api/users/${userId}/following`;

  const handleMouseEnter = () => {
    setOpen(true);
    setLoading(true);
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  };

  const handleMouseLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 200);
  };

  const handlePopoverEnter = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const handlePopoverLeave = () => {
    setOpen(false);
  };

  // Each user row is about 44px tall, so 4*44 + padding ≈ 192px
  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {open && (
        <div
          onMouseEnter={handlePopoverEnter}
          onMouseLeave={handlePopoverLeave}
          className="absolute z-40 left-1/2 -translate-x-1/2 mt-2 w-64 max-h-[192px] overflow-y-auto bg-neutral-900 border border-orange-400/20 rounded-xl shadow-xl p-4"
        >
          <div className="font-semibold text-orange-300 mb-2 text-center">
            {type === "followers" ? "Followers" : "Following"}
          </div>
          {loading ? (
            <div className="text-center text-orange-400 py-4">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-neutral-400 py-4">
              No users found.
            </div>
          ) : (
            <ul>
              {users.slice(0, 100).map((user) => (
                <li key={user.id}>
                  <Link
                    href={`/profile/${user.id}`}
                    className="flex items-center gap-2 py-2 px-2 rounded hover:bg-orange-500/10 transition"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || user.email}
                        className="w-7 h-7 rounded-full border border-orange-400 object-cover"
                      />
                    ) : (
                      <DefaultAvatar size={28} />
                    )}
                    <span className="text-orange-200 font-medium">
                      {user.name || "No Name"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </span>
  );
}
