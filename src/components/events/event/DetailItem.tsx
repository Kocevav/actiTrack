import React from "react";

export function DetailItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <span className="text-zinc-100 font-semibold">{label}:</span>
      <span className="ml-1 text-orange-200">{value}</span>
    </div>
  );
}
