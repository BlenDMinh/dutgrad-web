import { z } from "zod";

// Schema for login form validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Schema for state parameter validation
export const stateParamSchema = z.string().min(1);

// Schema for auth response validation
export const authResponseSchema = z.object({
  token: z.string(),
  refresh: z.string().optional(),
  user: z
    .object({
      id: z.string().or(z.number()),
      email: z.string().email(),
      name: z.string().optional(),
    })
    .optional(),
  is_new_user: z.boolean().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
