/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { authService } from "@/services/api-services";
import { loginSchema, registerSchema } from "@/schemas/auth";

interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export async function loginUser(
  formData: FormData
): Promise<ActionResponse<{ accessToken: string; refreshToken?: string }>> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        error:
          validatedFields.error.errors[0].message ||
          "Invalid email or password",
      };
    }

    const authData = await authService.login({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });

    if (authData.refresh) {
      (await cookies()).set('refreshToken', authData.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    return {
      data: {
        accessToken: authData.token,
        refreshToken: authData.refresh,
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      error: error.message || 'Failed to authenticate. Please try again.',
    };
  }
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

export async function logoutUser(): Promise<ActionResponse<null>> {
  try {
    (await cookies()).delete("refreshToken");

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
