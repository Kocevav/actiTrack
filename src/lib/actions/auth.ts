"use server";

import { signIn } from "@/auth";

export const login = async () => {
  await signIn("strava", { redirectTo: "/events" });
};

export const logOut = async () => {};
