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

const oxanium = Oxanium({
  subsets: ["latin"],
});

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
      console.error("Registration failed");
    }
  };

  const handleStravaLogin = () => {
    login();
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 ${oxanium.className}`}
    >
      <div className="w-full max-w-md bg-white dark:bg-black rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
          Welcome to ActiTrack
        </h2>
        <p className="text-neutral-600 text-sm text-center mt-2 dark:text-neutral-300">
          Sign up with Strava or email to track your activities.
        </p>

        <form onSubmit={handleSubmit} className="my-6 flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="p-2 border rounded-md w-full text-sm md:text-base"
              />
              {errors.firstName?.map((msg, idx) => (
                <p key={idx} className="text-red-500 text-sm">
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
                className="p-2 border rounded-md w-full text-sm md:text-base"
              />
              {errors.lastName?.map((msg, idx) => (
                <p key={idx} className="text-red-500 text-sm">
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
              className="p-2 border rounded-md w-full text-sm md:text-base"
            />
            {errors.startDate?.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-sm">
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
              className="p-2 border rounded-md w-full text-sm md:text-base"
            />
            {errors.email?.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-sm">
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
              className="p-2 border rounded-md w-full text-sm md:text-base"
            />
            {errors.password?.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-sm">
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
              className="p-2 border rounded-md w-full text-sm md:text-base"
            />
            {errors.confirmPassword?.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-sm">
                {msg}
              </p>
            ))}
          </div>

          <button
            className="bg-orange-600 hover:bg-orange-700 transition duration-200 w-full text-white rounded-md h-10 font-medium shadow-md"
            type="submit"
          >
            Sign up &rarr;
          </button>

          <button
            onClick={handleStravaLogin}
            className="flex items-center justify-center space-x-2 px-4 w-full text-black rounded-md h-10 font-medium shadow-md bg-gray-50 dark:bg-zinc-900"
            type="button"
          >
            <IconBrandStrava className="h-5 w-5 text-orange-600" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Sign up with Strava
            </span>
          </button>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={changeWhichFormState}
              className="text-blue-500 hover:underline"
              type="button"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
