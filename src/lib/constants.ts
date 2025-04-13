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
    DOCUMENTS: (spaceId: string) => `/space/${spaceId}/documents`,
    USER_ROLE: (spaceId: string) => `/spaces/${spaceId}/user-role`,
    MEMBERS: (spaceId: string) => `/spaces/${spaceId}/members`,
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
  SPACES: {
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
