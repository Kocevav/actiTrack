"use client";
import React, { useState } from "react";
import { IconBrandStrava } from "@tabler/icons-react";
import { login } from "@/lib/actions/auth";
import { Oxanium } from "next/font/google";
import { signInSchema } from "../../lib/zod";
import { signIn } from "next-auth/react";

const oxanium = Oxanium({
  subsets: ["latin"],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LoginForm({
  changeWhichFormState,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeWhichFormState: any;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleEmailLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = signInSchema.safeParse({ email, password });

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;
      setFormErrors({
        email: flattened.email?.[0],
        password: flattened.password?.[0],
      });
      return;
    }

    setFormErrors({});
    signIn("credentials", result.data);
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
          Log in with Strava or email to track your activities.
        </p>

        <form
          onSubmit={handleEmailLogin}
          className="my-6 flex flex-col space-y-4"
        >
          <input
            type="email"
            id="credentials-email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded-md w-full text-sm md:text-base"
            required
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}

          <input
            type="password"
            id="credentials-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded-md w-full text-sm md:text-base"
            required
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}

          <button
            className="bg-orange-600 hover:bg-orange-700 transition duration-200 w-full text-white rounded-md h-10 font-medium shadow-md"
            type="submit"
          >
            Log in &rarr;
          </button>
        </form>

        <button
          onClick={handleStravaLogin}
          className="flex items-center justify-center space-x-2 px-4 w-full text-black rounded-md h-10 font-medium shadow-md bg-gray-50 dark:bg-zinc-900"
        >
          <IconBrandStrava className="h-5 w-5 text-orange-600" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Login with Strava
          </span>
        </button>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <button
            onClick={changeWhichFormState}
            className="text-blue-500 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
