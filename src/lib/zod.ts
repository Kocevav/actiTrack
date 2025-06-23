import { object, string, date, preprocess } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = object({
  email: string({ required_error: "Email is required" }).email("Invalid email"),
  firstName: string({ required_error: "Please fill in this field." }).min(
    1,
    "Please fill in this field."
  ),
  lastName: string({ required_error: "Please fill in this field." }).min(
    1,
    "Please fill in this field."
  ),
  startDate: preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, date().optional()),

  password: string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: string({
    required_error: "Password confirmation is required",
  })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Your passwords don't match",
  path: ["confirmPassword"],
});
