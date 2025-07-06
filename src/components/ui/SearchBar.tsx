import React, { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(input.trim());
      }}
      className="flex items-center gap-2 w-full max-w-md mx-auto mb-6"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search users by name or email..."
        className="flex-1 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:ring-2 focus:ring-orange-400 outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
      >
        Search
      </button>
    </form>
  );
}
