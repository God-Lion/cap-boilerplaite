import React from 'react'
import { useLocation } from 'react-router-dom'
import classnames from 'classnames'
import { FloatingTree } from '@floating-ui/react'
import type { ChildrenType, RootStylesType } from '../../types'
import { useVerticalNav } from '../../contexts/verticalNavContext'
import { menuClasses } from '../../utils/menuClasses'
import StyledVerticalMenu from '../../styles/vertical/StyledVerticalMenu'
import { verticalSubMenuToggleDuration } from '../../defaultConfigs'
import { Box } from '@cap/theme'
import { VerticalMenuContext } from '../../contexts/verticalMenuContext'
import type {
  VerticalMenuContextProps,
  OpenSubmenu,
  MenuSectionStyles,
} from '../../contexts/verticalMenuContext'

export { VerticalMenuContext }
export type { VerticalMenuContextProps, OpenSubmenu, MenuSectionStyles }

export type MenuProps = VerticalMenuContextProps &
  RootStylesType &
  Partial<ChildrenType> &
  React.MenuHTMLAttributes<HTMLMenuElement> & {
    popoutWhenCollapsed?: boolean
  }

const Menu: React.ForwardRefRenderFunction<HTMLMenuElement, MenuProps> = (
  {
    children,
    className,
    rootStyles,
    menuItemStyles,
    renderExpandIcon,
    renderExpandedMenuItemIcon,
    menuSectionStyles,
    browserScroll = false,
    triggerPopout = 'hover',
    popoutWhenCollapsed = false,
    subMenuOpenBehavior = 'accordion', // accordion, collapse
    transitionDuration = verticalSubMenuToggleDuration,
    collapsedMenuSectionLabel = '-',
    popoutMenuOffset = { mainAxis: 0 },
    textTruncate = true,
    ...rest
  },
  ref,
) => {
  const location = useLocation()
  const pathname = location.pathname
  const [openSubmenu, setOpenSubmenu] = React.useState<Array<OpenSubmenu>>([])
  const openSubmenusRef = React.useRef<Array<OpenSubmenu>>([])
  const { updateVerticalNavState } = useVerticalNav()

  const toggleOpenSubmenu = React.useCallback(
    (
      ...submenus: {
        level: number
        label: React.ReactNode
        active?: boolean
        id: string
      }[]
    ): void => {
      if (!submenus.length) return

      const openSubmenuCopy = [...openSubmenu]

      submenus.forEach(({ level, label, active = false, id }) => {
        const submenuIndex = openSubmenuCopy.findIndex((submenu) => submenu.id === id)
        const submenuExists = submenuIndex >= 0
        const isAccordion = subMenuOpenBehavior === 'accordion'

        const inactiveSubmenuIndex = openSubmenuCopy.findIndex(
          (submenu) => !submenu.active && submenu.level === 0,
        )

        // Delete submenu if it exists
        if (submenuExists) openSubmenuCopy.splice(submenuIndex, 1)

        if (isAccordion) {
          // Add submenu if it doesn't exist
          if (!submenuExists) {
            if (inactiveSubmenuIndex >= 0 && !active && level === 0)
              openSubmenuCopy.splice(inactiveSubmenuIndex, 1, {
                level,
                label,
                active,
                id,
              })
            else openSubmenuCopy.push({ level, label, active, id })
          }
        } else {
          // Add submenu if it doesn't exist
          if (!submenuExists) openSubmenuCopy.push({ level, label, active, id })
        }
      })

      setOpenSubmenu(openSubmenuCopy)
    },
    [openSubmenu, subMenuOpenBehavior],
  )

  React.useEffect(() => {
    setOpenSubmenu([...openSubmenusRef.current])
    openSubmenusRef.current = []
  }, [pathname])

  // UseEffect, update verticalNav state to set initial values and update values on change
  React.useEffect(() => {
    updateVerticalNavState({
      isPopoutWhenCollapsed: popoutWhenCollapsed,
    })
  }, [popoutWhenCollapsed, updateVerticalNavState])

  const providerValue = React.useMemo(
    () => ({
      browserScroll,
      triggerPopout,
      transitionDuration,
      menuItemStyles,
      menuSectionStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      openSubmenu,
      openSubmenusRef,
      toggleOpenSubmenu,
      subMenuOpenBehavior,
      collapsedMenuSectionLabel,
      popoutMenuOffset,
      textTruncate,
    }),
    [
      browserScroll,
      triggerPopout,
      transitionDuration,
      menuItemStyles,
      menuSectionStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      openSubmenu,
      openSubmenusRef,
      toggleOpenSubmenu,
      subMenuOpenBehavior,
      collapsedMenuSectionLabel,
      popoutMenuOffset,
      textTruncate,
    ],
  )

  return (
    <VerticalMenuContext.Provider value={providerValue}>
      <FloatingTree>
        <StyledVerticalMenu
          ref={ref}
          className={classnames(menuClasses.root, className)}
          rootStyles={rootStyles}
          {...rest}
        >
          <Box
            component='ul'
            sx={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {children}
          </Box>
        </StyledVerticalMenu>
      </FloatingTree>
    </VerticalMenuContext.Provider>
  )
}

export default React.forwardRef(Menu)
