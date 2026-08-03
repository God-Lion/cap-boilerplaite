import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  MenuItem,
  SubMenu,
  MenuSection
} from '../vertical-menu'
import type {
  NavItemConfig,
  NavVariant,
  Dictionary,
} from '@cap/shared-types'
import { useNavigationMenu } from '@cap/platform-core'

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
  const { t } = useTranslation()
  const filteredItems = useNavigationMenu(variant)
  const sortedItems = filteredItems // Hook already sorts

  const translateKey = (key?: string): string => {
    if (!key) return ''
    const cleanKey = key.replace(/^navigation\./, '')
    const dictValue = dictionary?.['navigation']?.[cleanKey] || dictionary?.[key] || dictionary?.[cleanKey]
    if (dictValue && typeof dictValue === 'string') return dictValue
    const tVal = t(key, { defaultValue: '' })
    if (tVal && tVal !== key) return tVal
    const tClean = t(`navigation.${cleanKey}`, { defaultValue: '' })
    if (tClean && tClean !== `navigation.${cleanKey}`) return tClean
    return cleanKey
  }

  // 3. Helper to render a single item recursively
  const renderItem = (item: NavItemConfig) => {
    const label = translateKey(item.label)
    const icon = item.icon
      ? React.isValidElement(item.icon)
        ? item.icon
        : typeof item.icon === 'string'
        ? item.icon.startsWith('tabler-')
          ? <i className={item.icon} />
          : <i className={`tabler-${item.icon}`} />
        : undefined
      : undefined

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
        const rawSection = sectionItem?.label || sectionItem?.section || 'Section'
        const sectionLabel = translateKey(rawSection)

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
