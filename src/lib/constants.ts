
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    GOOGLE: "/auth/oauth/google",
    CALLBACK: "/auth/callback",
    EXCHANGE_STATE: "/auth/exchange-state",
  },
  SPACE: {
    ALL: "/spaces",
    CREATE: "/spaces/create",
    PUBLIC: "/spaces/public",
    MINE: "/spaces/me",
    ROLES: "/spaces/roles",
    DETAIL: (spaceId: string) => `/spaces/${spaceId}`,
    INVITATIONS: (spaceId: string) => `/spaces/${spaceId}/invitations`,
    MY_INVITATIONS: () => `/invitations/me`,
    DOCUMENTS: (spaceId: string) => `/space/${spaceId}/documents`,
    USER_ROLE: (spaceId: string) => `/spaces/${spaceId}/user-role`,
    INVITATION_LINK: (spaceId: string) => `/spaces/${spaceId}/invitation-link`,
    JOIN_SPACE_LINK: (token : string)=> `/spaces/join?token=${token}`,
    JOIN_PUBLIC: (spaceId: string) => `/spaces/${spaceId}/join-public`,
    MEMBERS: (spaceId: string) => `/spaces/${spaceId}/members`,
    ACCEPT_INVITATION: (invitationId: string) => `/space-invitations/${invitationId}/accept`,
    REJECT_INVITATION: (invitationId: string) => `/space-invitations/${invitationId}/reject`,
  },

  DOCUMENT: {
    UPLOAD: "/documents/upload",
    DETAIL: (id: string) => `/documents/${id}`,
  },
  CHAT: {
    BEGIN_SESSION: "/user-query-sessions/begin-chat-session",
    ASK: "/user-query/ask",
  },
};

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  AUTH_CALLBACK: "/auth/callback",
  MY_INVITATIONS: "/invitation/me",
  SPACES: {
    CREATE: "/spaces/create",
    PUBLIC: "/spaces/public",
    MINE: "/spaces/me",
    MEMBER: (spaceId: string) => `/spaces/${spaceId}/members`,
  },
  DOCUMENT: {
    UPLOAD_PROGRESS: (id: string) => `/documents/upload-progress/${id}`,
  },
  CHAT: {
    SPACE: (spaceId: string, sessionId: string) =>
      `/spaces/${spaceId}/chat?sessionId=${sessionId}`,
  },
};

export const SPACE_ROLE = {
  OWNER: 1,
  EDITOR: 2,
  VIEWER: 3,
};
