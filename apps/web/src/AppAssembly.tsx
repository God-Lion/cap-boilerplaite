import { assembleApp } from '@cap/platform-core'
import { AuthModule } from '@cap/module-auth'
import { LandingModule } from '@cap/module-landing'
import { UserModule } from '@cap/module-user'

export const App = assembleApp({
    modules: [
        AuthModule,
        LandingModule,
        UserModule,
    ],
})

export default App
