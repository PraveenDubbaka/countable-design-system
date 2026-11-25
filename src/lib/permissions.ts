// Single place that decides who may change firm-wide settings (e.g. Settings › Roles).
// Today it is "the current user's access type is Admin" (a super admin). Change it here when real auth lands.

const ACCESS_TYPE_KEY = "cds_current_user_access_type_v1";

// Access type of the signed-in user. The demo user is an Admin; set localStorage[ACCESS_TYPE_KEY] to "General" to preview a non-admin.
export const getCurrentUserAccessType = (): string => {
  try { return localStorage.getItem(ACCESS_TYPE_KEY) || "Admin"; } catch { return "Admin"; }
};

export const canManageFirmSettings = (): boolean => getCurrentUserAccessType() === "Admin";

const USER_ID_KEY = "cds_current_user_id_v1";
export const USER_PERMS_KEY = "user-access-perms-v1";

// Id of the signed-in user in the User & Access list. The demo user is the firm owner (id "9"); set localStorage[USER_ID_KEY] to preview another member.
export const getCurrentUserId = (): string => {
  try { return localStorage.getItem(USER_ID_KEY) || "9"; } catch { return "9"; }
};

// May this user send client portal invites? Super admins always can; everyone else needs the "Send client portal invites"
// permission ticked for them in Settings › User & Access (saved in localStorage "user-access-perms-v1").
export const canSendInvites = (userId: string = getCurrentUserId()): boolean => {
  if (canManageFirmSettings()) return true;
  try {
    const saved = JSON.parse(localStorage.getItem(USER_PERMS_KEY) || "{}") as Record<string, { sendInvites?: boolean }>;
    return saved?.[userId]?.sendInvites === true;
  } catch { return false; }
};
