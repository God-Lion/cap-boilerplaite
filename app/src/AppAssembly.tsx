import { assembleApp } from '@cap/platform-core'
import { AuthModule, initAuthPlugins, MFATOTPPlugin } from '@cap/module-auth'
import { AdminModule } from '@cap/module-admin'
import { LandingModule } from '@cap/module-landing'
import { UserModule } from '@cap/module-user'
import { CivilRegistryModule } from '@cap/module-civil-registry'

// Initialize plugin infrastructure
initAuthPlugins([MFATOTPPlugin])

export const App = assembleApp({
  modules: [
    AuthModule,
    AdminModule,
    LandingModule,
    UserModule,
    CivilRegistryModule,
  ],
})

export default App
