import apiClient from "@/lib/axios";
import { handleResponse } from "./helper";
import { API_ROUTES } from "@/lib/constants";

export const userService = {
    getProfile: async () => {
      const response = await apiClient.get(API_ROUTES.USER.MINE);
      return handleResponse(response.data);
    },
    updateProfile: async (data: any) => {
      const response = await apiClient.put(API_ROUTES.USER.ME(data.id), data);
      return handleResponse(response.data);
    },
  };