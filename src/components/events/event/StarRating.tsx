import React, { useState } from "react";

export function StarRating({
  rating,
  setRating,
  disabled,
}: {
  rating: number | null;
  setRating: (n: number | null) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setRating(star)}
          className="focus:outline-none"
          disabled={disabled}
        >
          <span
            className={`text-2xl transition-colors select-none ${
              (hovered ?? rating!) >= star
                ? "text-yellow-400"
                : "text-gray-500 hover:text-yellow-300"
            }`}
          >
            ★
          </span>
        </button>
      ))}
      {rating && (
        <button
          type="button"
          onClick={() => setRating(null)}
          className="ml-2 text-sm text-gray-400 hover:text-gray-300"
          disabled={disabled}
        >
          Clear
        </button>
      )}
    </div>
  );
}
