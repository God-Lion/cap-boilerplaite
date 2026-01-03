import React from 'react'

type HorizontalSubMenuContextProps = {
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
}

export const HorizontalSubMenuContext = React.createContext<HorizontalSubMenuContextProps>({
  getItemProps: () => ({}),
})
