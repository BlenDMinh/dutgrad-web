"use server";

import axios, { AxiosError } from "axios";
import { API_ROUTES } from "@/lib/constants";
import {
  authResponseSchema,
  stateParamSchema,
  AuthResponse,
} from "@/schemas/auth";

type ExchangeStateResponse = {
  success: boolean;
  data?: AuthResponse;
  error?: string;
};

export async function exchangeStateAction(
  state: string
): Promise<ExchangeStateResponse> {
  // Validate input using Zod
  const stateValidation = stateParamSchema.safeParse(state);
  if (!stateValidation.success) {
    console.error("Invalid state parameter:", stateValidation.error);
    return {
      success: false,
      error: "Invalid state parameter",
    };
  }

  // Use the validated state
  const validatedState = stateValidation.data;

  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const endpoint = `${baseURL}${
      API_ROUTES.AUTH.EXCHANGE_STATE
    }?state=${encodeURIComponent(validatedState)}`;

    console.log("Calling API endpoint:", endpoint);

    const response = await axios.post(endpoint);

    // Debug log response data
    console.log("API Response status:", response.status);
    console.log("API Response data:", JSON.stringify(response.data, null, 2));

    // Validate response data using Zod
    const responseValidation = authResponseSchema.safeParse(response.data.data);
    if (!responseValidation.success) {
      console.error("Invalid response format:", responseValidation.error);
      return {
        success: false,
        error: "Invalid response from authentication server",
      };
    }

    return {
      success: true,
      data: responseValidation.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error("State exchange error:", error);
    console.error("Error status:", axiosError.response?.status);
    console.error("Error data:", axiosError.response?.data);

    return {
      success: false,
      error: "Failed to authenticate. Please try again.",
    };
  }
}
