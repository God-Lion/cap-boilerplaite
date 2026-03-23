export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  EMAIL_CHANGE = 'email_change',
  MFA_ENABLE = 'mfa_enable',
  MFA_DISABLE = 'mfa_disable',
  PROFILE_UPDATE = 'profile_update',
  ACCOUNT_DEACTIVATE = 'account_deactivate',
  ACCOUNT_DELETE = 'account_delete',
}

export default AuditAction
