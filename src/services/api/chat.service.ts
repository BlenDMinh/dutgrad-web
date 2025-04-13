import apiClient from "@/lib/axios";
import { handleResponse } from "./helper";
import { API_ROUTES } from "../../lib/constants";

// Interfaces for chat service
interface BeginSessionResponse {
  id: number;
  user_id: number;
  space_id: number;
  created_at: string;
  updated_at: string;
  user: any;
  space: any;
  user_query: any;
}

interface ChatQueryResponse {
  answer: string;
  query: {
    id: number;
    query_session_id: number;
    query: string;
    created_at: string;
    updated_at: string;
    user_query_session: {
      id: number;
      user_id: number;
      space_id: number;
      created_at: string;
      updated_at: string;
      user: any;
      space: any;
      user_query: any;
    };
  };
}

export const chatService = {
  beginChatSession: async (spaceId: number): Promise<BeginSessionResponse> => {
    const response = await apiClient.post(API_ROUTES.CHAT.BEGIN_SESSION, {
      space_id: spaceId,
    });
    return handleResponse(response.data);
  },

  askQuestion: async (
    querySessionId: number,
    query: string
  ): Promise<ChatQueryResponse> => {
    const response = await apiClient.post(API_ROUTES.CHAT.ASK, {
      query_session_id: querySessionId,
      query: query,
    });
    return handleResponse(response.data);
  },

  // You can add more methods here as needed
  getSessionHistory: async (sessionId: number) => {
    // This is a placeholder for future implementation
    // Would fetch previous messages in a chat session
  },
};
