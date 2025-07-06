// components/events/CreateEventButton.tsx
import React from "react";

export function CreateEventButton({
  onClick,
  loading,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (e: any) => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      aria-label="Host an Event"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>Host an Event</span>
      {loading && (
        <svg
          className="animate-spin ml-2 h-5 w-5 text-white"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
    </button>
  );
}
