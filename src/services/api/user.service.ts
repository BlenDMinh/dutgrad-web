import apiClient from "@/lib/axios";
import { handleResponse } from "./helper";
import { API_ROUTES } from "@/lib/constants";

export interface User {
  id: number;
  username: string;
  email: string;
  active: boolean;
  tier_id: number | null;
  created_at: string;
  updated_at: string;
  sessions: any | null;
  tier: any | null;
}

export interface UserSearchResponse {
  users: User[];
}

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get(API_ROUTES.USER.MINE);
    return handleResponse(response.data);
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.put(API_ROUTES.USER.ME(data.id), data);
    return handleResponse(response.data);
  },
  searchUsers: async (query: string): Promise<UserSearchResponse> => {
    const response = await apiClient.get(
      `${API_ROUTES.USER.SEARCH}?query=${encodeURIComponent(query)}`
    );
    return handleResponse(response.data);
  },
};
