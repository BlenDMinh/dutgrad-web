import { z } from "zod";

// Login request validation schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Authentication response schema
export const authResponseSchema = z.object({
  token: z.string(),
  user: z.any(),
  expires: z.string(),
  is_new_user: z.boolean(),
});

// State parameter schema
export const stateParamSchema = z
  .string()
  .min(1, "State parameter is required");

// Export types derived from schemas
export type LoginCredentials = z.infer<typeof loginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
