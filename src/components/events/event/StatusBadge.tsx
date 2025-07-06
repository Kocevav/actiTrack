import React from "react";

export function StatusBadge({ status }: { status: string }) {
  let label = "";
  let color = "";

  switch (status) {
    case "CREATED":
      label = "Active";
      color = "bg-green-600/80 text-white";
      break;
    case "FINISHED":
      label = "Finished";
      color = "bg-gray-600/80 text-gray-200";
      break;
    case "ARCHIVED":
      label = "Archived";
      color = "bg-yellow-800/80 text-yellow-200";
      break;
    default:
      label = "Unknown";
      color = "bg-gray-400 text-white";
  }

  return (
    <span
      className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${color}`}
    >
      {label}
    </span>
  );
}
