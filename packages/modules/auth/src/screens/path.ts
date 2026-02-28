import PathAccount from './account/path'
import PathMFA from './mfa/path'
import PathPasskey from './passkey/path'
import PathPasswordless from './passwordless/path'
import PathAuth from './auth/path'
import PathMonitoring from './monitoring/path'
import PathAPITokens from './api-tokens/path'
import PathAdmin from './admin/path'

const Path = {
  auth: PathAuth,
  account: PathAccount,
  mfa: PathMFA,
  passkey: PathPasskey,
  passwordless: PathPasswordless,
  monitoring: PathMonitoring,
  apiTokens: PathAPITokens,
  admin: PathAdmin,
}
export default Path
