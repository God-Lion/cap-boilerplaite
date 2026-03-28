import { useAppStore } from '@cap/platform-core'

export const useHorizontalNav = () => {
  const horizontalNav = useAppStore((state) => state.horizontalNav)
  const updateIsBreakpointReached = useAppStore((state) => state.updateIsBreakpointReached)

  return {
    ...horizontalNav,
    updateIsBreakpointReached,
  }
}
