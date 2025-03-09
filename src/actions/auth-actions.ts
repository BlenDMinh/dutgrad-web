"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { authService } from "@/services/api-services";
import { loginSchema } from "@/schemas/auth";

interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export async function loginUser(
  formData: FormData
): Promise<ActionResponse<{ accessToken: string; refreshToken?: string }>> {
  try {
    // Extract credentials
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

    // Make API request using our service
    const authData = await authService.login({ 
      email: validatedFields.data.email,
      password: validatedFields.data.password
    });

    // If login is successful and there's a refresh token, store in cookies
    if (authData.refresh) {
      (await cookies()).set("refreshToken", authData.refresh, {
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
        accessToken: authData.token,
        refreshToken: authData.refresh,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      error: error.message || "Failed to authenticate. Please try again.",
    };
  }
}

export async function logoutUser(): Promise<ActionResponse<null>> {
  try {
    // Clear the refresh token cookie
    (await cookies()).delete("refreshToken");

    // Optionally call logout endpoint to invalidate token on server
    try {
      await authService.logout();
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
