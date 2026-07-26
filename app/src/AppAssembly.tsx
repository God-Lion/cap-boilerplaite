import { assembleApp } from '@cap/platform-core'
import type { CAPModule } from '@cap/shared-types'

// The glob automatically imports all index.ts files it finds in the modules directory
const moduleImports = import.meta.glob('../../packages/modules/*/src/index.ts', { eager: true })

export const assembleModules = (): CAPModule[] => {
  const assembledModules: CAPModule[] = []

  for (const path in moduleImports) {
    const mod = moduleImports[path] as Record<string, any>
    
    // Iterate over all exports to find the module contract
    for (const key in mod) {
      const exportVal = mod[key]
      if (exportVal && typeof exportVal === 'object' && exportVal.id && exportVal.version) {
        assembledModules.push(exportVal as CAPModule)
      }
    }
  }

  return assembledModules
}

export const globalModules = assembleModules()

export const App = assembleApp({
  modules: globalModules,
})

export default App
