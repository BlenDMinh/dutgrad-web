import apiClient from '@/lib/axios';
import { handleResponse } from './helper';
import { API_ROUTES } from '../../lib/constants';

export const spaceService = {
  createSpace: async (data: {
    name: string;
    description: string;
    privacy_status: boolean;
  }) => {
    const response = await apiClient.post(API_ROUTES.SPACE.ALL, data);
    return handleResponse(response.data);
  },
  getSpacePublic: async () => {
    const response = await apiClient.get(API_ROUTES.SPACE.PUBLIC);
    return handleResponse(response.data);
  },
  getYourSpaces: async () => {
    const response = await apiClient.get(API_ROUTES.SPACE.MINE);
    return handleResponse(response.data);
  },
  getSpaceById: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.DETAIL(spaceId));
    return handleResponse(response.data);
  },
  getDocumentBySpace: async (
    spaceId: string,
    page: number = 1,
    pageSize: number = 20
  ) => {
    const response = await apiClient.get(API_ROUTES.SPACE.DOCUMENTS(spaceId), {
      params: { page, pageSize },
    });
    return handleResponse(response.data);
  },
  getSpaceMembers: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.MEMBERS(spaceId));
    return handleResponse(response.data);
  },
  getSpaceInvitations: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.INVITATIONS(spaceId));
    return handleResponse(response.data);
  },
  inviteUser: async (
    spaceId: string,
    invited_user_email: string,
    space_role_id: number
  ) => {
    const response = await apiClient.post(
      API_ROUTES.SPACE.INVITATIONS(spaceId),
      { invited_user_email, space_role_id }
    );
    return handleResponse(response.data);
  },
  getSpaceRoles: async () => {
    const response = await apiClient.get(API_ROUTES.SPACE.ROLES);
    return handleResponse(response.data);
  },
  getUserRole: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.USER_ROLE(spaceId));
    return handleResponse(response.data);
  },
  getOrCreateInviteLink: async (spaceId: string, spaceRoleId: number) => {
    const response = await apiClient.put(
      `${API_ROUTES.SPACE.INVITATION_LINK(spaceId)}`,
      {
        space_role_id: spaceRoleId,
      }
    );
    return handleResponse(response.data);
  },
  joinSpaceWithToken: async (token: string) => {
    const response = await apiClient.post(`${API_ROUTES.SPACE.JOIN_SPACE_LINK(token)}`);
    return handleResponse(response.data);
  },
  getMyInvitations: async () => {
    const response = await apiClient.get(`${API_ROUTES.SPACE.MY_INVITATIONS()}`);
    return handleResponse(response.data);
  },

  acceptInvitation: async (invitationId: string) => {
    const response = await apiClient.put(`${API_ROUTES.SPACE.ACCEPT_INVITATION(invitationId)}`);
    return handleResponse(response.data);
  }
  
};
