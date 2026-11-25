// Single place that decides who may change firm-wide settings (e.g. Settings › Roles).
// Today it is "the current user's access type is Admin" (a super admin). Change it here when real auth lands.

const ACCESS_TYPE_KEY = "cds_current_user_access_type_v1";

// Access type of the signed-in user. The demo user is an Admin; set localStorage[ACCESS_TYPE_KEY] to "General" to preview a non-admin.
export const getCurrentUserAccessType = (): string => {
  try { return localStorage.getItem(ACCESS_TYPE_KEY) || "Admin"; } catch { return "Admin"; }
};

export const canManageFirmSettings = (): boolean => getCurrentUserAccessType() === "Admin";
