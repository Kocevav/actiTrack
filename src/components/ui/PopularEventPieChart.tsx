// components/ui/PopularEventPieChart.tsx
"use client";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#fb923c",
  "#fbbf24",
  "#f472b6",
  "#818cf8",
  "#34d399",
  "#f87171",
  "#60a5fa",
];

export function PopularEventPieChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events/popular-of-day")
      .then((res) => res.json())
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-orange-500"
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
        <span className="ml-4 text-orange-200 font-semibold">
          Loading chart…
        </span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center py-12 text-orange-200">
        No event comments today.
      </div>
    );
  }

  return (
    <>
      <h3 className="text-2xl font-extrabold text-orange-300 tracking-wide text-center mb-4 drop-shadow">
        Most Popular Events Today
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            labelLine={false}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid #fb923c",
              color: "#fb923c",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fb923c" }}
            itemStyle={{ color: "#fb923c" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
