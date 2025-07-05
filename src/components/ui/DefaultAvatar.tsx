import React from "react";

export default function DefaultAvatar({ size = 112 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bg-neutral-800 rounded-full border-4 border-orange-500 shadow-lg"
    >
      <circle cx="56" cy="56" r="54" fill="#18181b" />
      {/* Face */}
      <circle cx="56" cy="46" r="24" fill="#f59e42" />
      {/* Shoulders */}
      <ellipse cx="56" cy="86" rx="32" ry="18" fill="#f59e42" opacity="0.7" />
      {/* Eyes */}
      <ellipse cx="46" cy="46" rx="3" ry="4" fill="#18181b" />
      <ellipse cx="66" cy="46" rx="3" ry="4" fill="#18181b" />
      {/* Smile */}
      <path
        d="M48 58 Q56 66 64 58"
        stroke="#18181b"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
