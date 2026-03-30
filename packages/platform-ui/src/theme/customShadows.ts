import type { Theme } from '@mui/material/styles'
import { themeCustomShadows as createCustomShadows, type SystemMode } from '@cap/theme'

const customShadows = (mode: SystemMode): Theme['customShadows'] => createCustomShadows(mode)

export { type SystemMode }
export default customShadows
