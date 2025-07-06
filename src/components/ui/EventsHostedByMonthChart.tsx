"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function EventsHostedByMonthChart({ userId }: { userId: string }) {
  const [data, setData] = useState<{ month: string; hosted: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${userId}/events-by-month`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      });
  }, [userId]);

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

  return (
    <div className="w-full max-w-xl mx-auto bg-neutral-900/80 rounded-2xl p-6 shadow-lg border border-orange-400/10">
      <h3 className="text-lg font-bold text-orange-200 mb-4">
        Events Hosted Per Month
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#fb923c22" />
          <XAxis dataKey="month" stroke="#fb923c" />
          <YAxis stroke="#fb923c" />
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
          <Bar dataKey="hosted" fill="#fb923c" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
