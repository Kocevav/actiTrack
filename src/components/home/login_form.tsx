"use client";
import React, { useState } from "react";
import { IconBrandStrava } from "@tabler/icons-react";
import { login } from "@/lib/actions/auth";
import { Oxanium } from "next/font/google";
import { signInSchema } from "../../lib/zod";
import { signIn } from "next-auth/react";
import Spinner from "../ui/spiner";

const oxanium = Oxanium({ subsets: ["latin"] });

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
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
    setLoading(true);
    // signIn will redirect, so loading will end on page change
    await signIn("credentials", result.data);
  };

  const handleStravaLogin = async () => {
    setLoading(true);
    login();
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 bg-transparent ${oxanium.className}`}
    >
      {/* Spinner Overlay */}
      {loading && <Spinner text="Loggin in.." />}
      <div className="w-full max-w-md bg-neutral-900/90 border border-orange-400/20 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
        <h2 className="font-extrabold text-2xl text-orange-200 text-center tracking-wide drop-shadow">
          Welcome to ActiTrack
        </h2>
        <p className="text-neutral-400 text-sm text-center mt-2 mb-6">
          Log in with Strava or email to track your activities.
        </p>

        <form onSubmit={handleEmailLogin} className="flex flex-col space-y-4">
          <div>
            <input
              type="email"
              id="credentials-email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 text-white placeholder-neutral-500 outline-none transition"
              required
              disabled={loading}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              id="credentials-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 text-white placeholder-neutral-500 outline-none transition"
              required
              disabled={loading}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>
          <button
            className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 transition w-full text-white rounded-lg h-11 font-semibold shadow-lg text-lg"
            type="submit"
            disabled={loading}
          >
            Log in &rarr;
          </button>
        </form>

        <button
          onClick={handleStravaLogin}
          className="flex items-center justify-center gap-2 mt-4 px-4 w-full h-11 rounded-lg font-semibold shadow-md bg-neutral-800 hover:bg-orange-900/30 transition text-orange-400 border border-orange-400/30"
          disabled={loading}
        >
          <IconBrandStrava className="h-5 w-5 text-orange-500" />
          <span className="text-orange-200">Login with Strava</span>
        </button>

        <div className="text-center text-sm mt-6">
          <span className="text-neutral-400">Don&apos;t have an account? </span>
          <button
            onClick={changeWhichFormState}
            className="text-orange-400 hover:underline font-semibold"
            disabled={loading}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
