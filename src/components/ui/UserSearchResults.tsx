/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/UserSearchResults.tsx
import DefaultAvatar from "@/components/ui/DefaultAvatar";

export default function UserSearchResults({
  users,
  onSelect,
}: {
  users: any[];
  onSelect: (id: string) => void;
}) {
  if (!users.length) {
    return (
      <div className="text-center text-neutral-400 mt-4">No users found.</div>
    );
  }
  return (
    <div className="space-y-4 mt-2">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelect(user.id)}
          className="flex items-center gap-4 w-full bg-neutral-800 rounded-xl p-4 border border-neutral-700 hover:bg-orange-900/20 transition"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || user.email}
              className="w-12 h-12 rounded-full border-2 border-orange-400 object-cover"
            />
          ) : (
            <DefaultAvatar size={48} />
          )}
          <div>
            <div className="font-semibold text-orange-200">
              {user.name || "No Name"}
            </div>
            <div className="text-neutral-400 text-sm">{user.email}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
