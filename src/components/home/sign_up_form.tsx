"use client";
import React, { useState } from "react";
import { IconBrandStrava } from "@tabler/icons-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import { Oxanium } from "next/font/google";
import { login } from "@/lib/actions/auth";
import { signUpSchema } from "@/lib/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import Spinner from "../ui/spiner";

const oxanium = Oxanium({ subsets: ["latin"] });

registerLocale("en", enGB);

export default function SignUpForm({
  changeWhichFormState,
}: {
  changeWhichFormState: () => void;
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof signUpSchema>, string[]>>
  >({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = signUpSchema.safeParse({
      email,
      firstName,
      lastName,
      startDate,
      password,
      confirmPassword,
    });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    if (res.ok) {
      await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: true,
        callbackUrl: "/events",
      });
    } else {
      setLoading(false);
      console.error("Registration failed");
    }
  };

  const handleStravaLogin = () => {
    setLoading(true);
    login();
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 bg-transparent ${oxanium.className}`}
    >
      {/* Spinner Overlay */}
      {loading && <Spinner text=" Creating your account…" />}
      <div className="w-full max-w-md bg-neutral-900/70 backdrop-blur-md border border-orange-400/20 rounded-2xl shadow-2xl p-8">
        <h2 className="font-extrabold text-2xl text-orange-200 text-center tracking-wide drop-shadow">
          Welcome to ActiTrack
        </h2>
        <p className="text-neutral-400 text-sm text-center mt-2 mb-6">
          Sign up with Strava or email to track your activities.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 text-white placeholder-neutral-500 outline-none transition w-full"
                disabled={loading}
              />
              {errors.firstName?.map((msg, idx) => (
                <p key={idx} className="text-red-500 text-xs mt-1">
                  {msg}
                </p>
              ))}
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 text-white placeholder-neutral-500 outline-none transition w-full"
                disabled={loading}
              />
              {errors.lastName?.map((msg, idx) => (
                <p key={idx} className="text-red-500 text-xs mt-1">
                  {msg}
                </p>
              ))}
            </div>
          </div>
          <div>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              placeholderText="Select Date of Birth"
              dateFormat="dd/MM/yyyy"
              locale="en"
              className="px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 text-white placeholder-neutral-500 outline-none transition w-full"
              disabled={loading}
            />
            {errors.startDate?.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-xs mt-1">
                {msg}
              </p>
            ))}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 text-white placeholder-neutral-500 outline-none transition w-full"
              disabled={loading}
            />
            {errors.email?.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-xs mt-1">
                {msg}
              </p>
            ))}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 text-white placeholder-neutral-500 outline-none transition w-full"
              disabled={loading}
            />
            {errors.password?.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-xs mt-1">
                {msg}
              </p>
            ))}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 text-white placeholder-neutral-500 outline-none transition w-full"
              disabled={loading}
            />
            {errors.confirmPassword?.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-xs mt-1">
                {msg}
              </p>
            ))}
          </div>
          <button
            className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 transition w-full text-white rounded-lg h-11 font-semibold shadow-lg text-lg"
            type="submit"
            disabled={loading}
          >
            Sign up &rarr;
          </button>
        </form>

        <button
          onClick={handleStravaLogin}
          className="flex items-center justify-center gap-2 mt-4 px-4 w-full h-11 rounded-lg font-semibold shadow-md bg-neutral-800 hover:bg-orange-900/30 transition text-orange-400 border border-orange-400/30"
          type="button"
          disabled={loading}
        >
          <IconBrandStrava className="h-5 w-5 text-orange-500" />
          <span className="text-orange-200">Sign up with Strava</span>
        </button>

        <div className="text-center text-sm mt-6">
          <span className="text-neutral-400">Already have an account? </span>
          <button
            onClick={changeWhichFormState}
            className="text-orange-400 hover:underline font-semibold"
            type="button"
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
