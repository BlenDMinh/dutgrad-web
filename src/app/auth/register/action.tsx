"use server";

import { cookies } from "next/headers";
import { registerSchema } from "@/schemas/auth";
import { authService } from "@/services/api/auth.service";

interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export async function registerUser(
  formData: FormData
): Promise<ActionResponse<{ accessToken: string; refreshToken?: string }>> {
  try {
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validatedFields = registerSchema.safeParse({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirmPassword: password,
    });

    if (!validatedFields.success) {
      return {
        error:
          validatedFields.error.errors[0].message ||
          'Invalid registration details',
      };
    }

    const authData = await authService.register(validatedFields.data);

    if (authData.refresh) {
      (await cookies()).set("refreshToken", authData.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return {
      data: {
        accessToken: authData.token,
        refreshToken: authData.refresh,
      },
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      error: error.message || "Failed to register. Please try again.",
    };
  }
}
