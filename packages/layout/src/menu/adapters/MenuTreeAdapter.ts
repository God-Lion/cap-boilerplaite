import type { NavItemConfig, Dictionary } from '@cap/shared-types'

export interface ProcessedNavItem {
  id: string
  label: string
  path?: string
  icon?: string | React.ReactNode
  children?: ProcessedNavItem[]
}

export interface ProcessedMenuSection {
  id?: string
  label?: string
  items: ProcessedNavItem[]
}

export class MenuTreeAdapter {
  /**
   * Translates a navigation label key against module dictionaries or i18next fallback.
   */
  public static translateKey(
    key?: string,
    dictionary?: Dictionary,
    t?: (key: string, options?: { defaultValue?: string }) => string
  ): string {
    if (!key) return ''
    const cleanKey = key.replace(/^navigation\./, '')
    const dictValue = dictionary?.['navigation']?.[cleanKey] || dictionary?.[key] || dictionary?.[cleanKey]
    if (dictValue && typeof dictValue === 'string') return dictValue

    if (t) {
      const tVal = t(key, { defaultValue: '' })
      if (tVal && tVal !== key) return tVal
      const tClean = t(`navigation.${cleanKey}`, { defaultValue: '' })
      if (tClean && tClean !== `navigation.${cleanKey}`) return tClean
    }

    return cleanKey
  }

  /**
   * Adapts raw NavItemConfig items into grouped sections with pre-translated labels.
   */
  public static buildMenuTree(
    items: NavItemConfig[],
    dictionary?: Dictionary,
    t?: (key: string, options?: { defaultValue?: string }) => string
  ): ProcessedMenuSection[] {
    const processItem = (item: NavItemConfig): ProcessedNavItem => {
      const label = MenuTreeAdapter.translateKey(item.label, dictionary, t)
      const sortedChildren = item.children && item.children.length > 0
        ? [...item.children].sort((a, b) => (a.order || 0) - (b.order || 0)).map(processItem)
        : undefined

      return {
        id: item.id,
        label,
        path: item.path,
        icon: item.icon,
        children: sortedChildren,
      }
    }

    const sections: ProcessedMenuSection[] = []
    let currentSectionId: string | undefined = undefined
    let currentItems: ProcessedNavItem[] = []

    const flush = () => {
      if (currentItems.length > 0) {
        if (currentSectionId) {
          const sectionItem = items.find((i) => i.id === currentSectionId)
          const rawSection = sectionItem?.label || sectionItem?.section || 'Section'
          const sectionLabel = MenuTreeAdapter.translateKey(rawSection, dictionary, t)
          sections.push({
            id: currentSectionId,
            label: sectionLabel,
            items: currentItems,
          })
        } else {
          sections.push({ items: currentItems })
        }
        currentItems = []
      }
    }

    items.forEach((item) => {
      if (item.section) {
        flush()
        currentSectionId = item.id
        if (item.path || (item.children && item.children.length > 0)) {
          currentItems.push(processItem(item))
        }
      } else {
        currentItems.push(processItem(item))
      }
    })
    flush()

    return sections
  }
}
