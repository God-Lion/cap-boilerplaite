import React from 'react'
import classnames from 'classnames'
import { FloatingTree } from '@floating-ui/react'
import type { ChildrenType, RootStylesType } from '../../types'
import { menuClasses } from '../../utils/menuClasses'
import StyledHorizontalMenu from '../../styles/horizontal/StyledHorizontalMenu'
import { horizontalSubMenuToggleDuration } from '../../defaultConfigs'
import styles from '../../styles/horizontal/horizontalUl.module.css'
import {
  HorizontalMenuContext,
  HorizontalMenuContextProps,
} from '../../contexts/horizontalMenuContext'

export type MenuProps = HorizontalMenuContextProps &
  RootStylesType &
  Partial<ChildrenType> &
  React.MenuHTMLAttributes<HTMLMenuElement>

const Menu: React.ForwardRefRenderFunction<HTMLMenuElement, MenuProps> = (props, ref) => {
  const {
    children,
    className,
    rootStyles,
    menuItemStyles,
    triggerPopout = 'hover',
    browserScroll = false,
    transitionDuration = horizontalSubMenuToggleDuration,
    renderExpandIcon,
    renderExpandedMenuItemIcon,
    popoutMenuOffset = { mainAxis: 0 },
    textTruncate = true,
    verticalMenuProps,
    ...rest
  } = props

  const providerValue = React.useMemo(
    () => ({
      triggerPopout,
      browserScroll,
      menuItemStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      transitionDuration,
      popoutMenuOffset,
      textTruncate,
      verticalMenuProps,
    }),
    [
      triggerPopout,
      browserScroll,
      menuItemStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      transitionDuration,
      popoutMenuOffset,
      textTruncate,
      verticalMenuProps,
    ],
  )

  return (
    <HorizontalMenuContext.Provider value={providerValue}>
      <FloatingTree>
        <StyledHorizontalMenu
          ref={ref}
          className={classnames(menuClasses.root, className)}
          rootStyles={rootStyles}
          {...rest}
        >
          <ul className={styles.root}>{children}</ul>
        </StyledHorizontalMenu>
      </FloatingTree>
    </HorizontalMenuContext.Provider>
  )
}

export default React.forwardRef(Menu)
