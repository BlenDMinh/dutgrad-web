import apiClient from "@/lib/axios";
import { handleResponse } from "./helper";
import { API_ROUTES } from "../../lib/constants";

export const spaceService = {
    getSpacePublic: async () => {
      const response = await apiClient.get(API_ROUTES.SPACE.PUBLIC);
      return handleResponse(response.data);
    },
};