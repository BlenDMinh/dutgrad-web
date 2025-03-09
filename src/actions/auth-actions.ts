"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import api from "@/lib/axios";
import { API_ROUTES } from "@/lib/constants";
import { loginSchema } from "@/schemas/auth";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function loginUser(
  formData: FormData
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  try {
    // Extract and validate credentials
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate using zod schema
    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        error:
          validatedFields.error.errors[0].message ||
          "Invalid email or password",
      };
    }

    // Make API request
    const response = await api.post(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    });

    // If login is successful, store refresh token in cookies
    if (response.data.refreshToken) {
      (await cookies()).set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    // Return tokens to client
    return {
      data: {
        accessToken: response.data.token,
        refreshToken: response.data.refresh,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      error:
        error.response?.data?.message ||
        "Failed to authenticate. Please try again.",
    };
  }
}

export async function logoutUser(): Promise<ApiResponse<null>> {
  try {
    // Clear the refresh token cookie
    (await cookies()).delete("refreshToken");

    // Optionally call logout endpoint to invalidate token on server
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      console.log(
        "Error calling logout endpoint, continuing logout process:",
        error
      );
    }

    return { data: null };
  } catch (error: any) {
    return { error: "Failed to logout. Please try again." };
  }
}
