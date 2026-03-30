import type { Theme } from '@mui/material/styles'
import { themeShadows as createShadows, type SystemMode } from '@cap/theme'

const shadows = (mode: SystemMode): Theme['shadows'] => createShadows(mode)

export { type SystemMode }
export default shadows
