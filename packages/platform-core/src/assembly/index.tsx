import i18next from 'i18next'
import { CAPModule } from '../types'

interface AssembleAppProps {
  modules: Array<CAPModule>
}

export type AuthRouteConfig = {
  path: string
  element: React.JSX.Element
  layout?: 'public' | 'vertical' | 'horizontal' | 'noLayout'
}

export const assembleApp = ({ modules }: AssembleAppProps) => {
  // Register module i18n resources
  modules.forEach((module) => {
    if (module.i18n) {
      Object.entries(module.i18n).forEach(([lang, resources]) => {
        // Register the module's resources.
        // We add them to both 'translation' (default) and 'common' namespaces
        // to ensure maximum compatibility with existing code.
        i18next.addResourceBundle(lang.toLowerCase(), 'translation', resources, true, true)
        i18next.addResourceBundle(lang.toLowerCase(), 'common', resources, true, true)
      })
    }
  })

  // Return the App component that renders the module-provided route components
  const App = () => {
    return (
      <>
        {modules.map((module) => {
          const RoutesComponent = module.routes
          return RoutesComponent ? <RoutesComponent key={module.id} /> : null
        })}
      </>
    )
  }

  return App
}
