import React from 'react'
import classnames from 'classnames'
import type { MenuButtonProps } from '../../types'
import { RouterLink } from '../RouterLink'

const MenuButton: React.ForwardRefRenderFunction<HTMLAnchorElement, MenuButtonProps> = (
  { className, component, children, ...rest },
  forwardedRef,
) => {
  if (component) {
    // If component is a string, create a new element of that type
    if (typeof component === 'string') {
      return React.createElement(
        component,
        // eslint-disable-next-line
        {
          className,
          ...rest,
          ref: forwardedRef,
        },
        children,
      )
    } else if (React.isValidElement(component)) {
      // If it's a ReactElement, clone it
      const { className: classNameProp, ...props } =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as unknown as React.ReactElement).props as any

      return React.cloneElement(
        component as React.ReactElement,
        // eslint-disable-next-line
        {
          className: classnames(className, classNameProp),
          ...rest,
          ...props,
          ref: forwardedRef,
        },
        children,
      )
    } else {
      // If it's a ComponentType, create an element from it
      const Component = component as React.ElementType
      return (
        <Component className={className} ref={forwardedRef} {...rest}>
          {children}
        </Component>
      )
    }
  } else {
    if (rest.href) {
      return (
        <RouterLink ref={forwardedRef} className={className} to={rest.href} {...rest}>
          {children}
        </RouterLink>
      )
    } else {
      return (
        <a ref={forwardedRef} className={className} {...rest}>
          {children}
        </a>
      )
    }
  }
}

export default React.forwardRef(MenuButton)
