import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MenuItem, 
  SubMenu, 
  MenuSection 
} from '../vertical-menu'
import { 
  useNavigationMenu,
  type NavItemConfig, 
  type NavVariant,
  type Dictionary,
} from '@cap/platform-core'

interface Props {
  variant: NavVariant
  dictionary: Dictionary
}

/**
 * ModuleMenuRenderer
 * 
 * The 'connector' that snaps module-declared navigation into the menu.
 * It filters, sorts, and groups items by section before rendering.
 */
const ModuleMenuRenderer: React.FC<Props> = ({ variant, dictionary }) => {
  const filteredItems = useNavigationMenu(variant)
  const sortedItems = filteredItems // Hook already sorts

  // 3. Helper to render a single item recursively
  const renderItem = (item: NavItemConfig) => {
    const label = dictionary['navigation']?.[item.label.replace('navigation.', '')] || item.label
    const icon = item.icon ? <i className={item.icon} /> : undefined

    if (item.children && item.children.length > 0) {
      // Sort children
      const sortedChildren = [...item.children].sort((a, b) => (a.order || 0) - (b.order || 0))
      
      return (
        <SubMenu key={item.id} label={label} icon={icon}>
          {sortedChildren.map(child => renderItem(child))}
        </SubMenu>
      )
    }

    return (
      <MenuItem 
        key={item.id} 
        component={item.path ? <Link to={item.path} /> : 'div'} 
        icon={icon}
      >
        {label}
      </MenuItem>
    )
  }

  // 4. Group by section and render
  const renderedSections: React.ReactNode[] = []
  let currentSectionId: string | undefined = undefined
  let currentSectionItems: React.ReactNode[] = []

  const flushSection = () => {
    if (currentSectionItems.length > 0) {
      if (currentSectionId) {
        // Find the item that defined this section to get its label
        const sectionItem = sortedItems.find(i => i.id === currentSectionId)
        const sectionLabel = sectionItem?.section || 'Section'
        
        renderedSections.push(
          <MenuSection key={currentSectionId} label={sectionLabel}>
            {currentSectionItems}
          </MenuSection>
        )
      } else {
        renderedSections.push(...currentSectionItems)
      }
      currentSectionItems = []
    }
  }

  sortedItems.forEach(item => {
    if (item.section) {
      flushSection()
      currentSectionId = item.id
      // If it has children or a path, render it inside the section
      // Otherwise it's just a section header definition
      if (item.path || (item.children && item.children.length > 0)) {
        currentSectionItems.push(renderItem(item))
      }
    } else {
      currentSectionItems.push(renderItem(item))
    }
  })
  flushSection()

  return <>{renderedSections}</>
}

export default ModuleMenuRenderer
