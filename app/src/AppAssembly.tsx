import { assembleApp } from '@cap/platform-core'
import { AuthModule, initAuthPlugins, MFATOTPPlugin } from '@cap/module-auth'
import { AdminModule } from '@cap/module-admin'
import { LandingModule } from '@cap/module-landing'
import { UserModule } from '@cap/module-user'
import { CivilRegistryModule } from '@cap/civil-registry'
import { DigitalIdModule } from '@cap/module-digital-id'
import { KycModule } from '@cap/module-kyc'
import { MonitoringAlertsModule } from '@cap/module-monitoring-alerts'
import { BlockchainIdaasModule } from '@cap/module-blockchain-idaas'

// Initialize plugin infrastructure
initAuthPlugins([MFATOTPPlugin])

export const App = assembleApp({
  modules: [
    AuthModule,
    AdminModule,
    LandingModule,
    UserModule,
    CivilRegistryModule,
    DigitalIdModule,
    KycModule,
    MonitoringAlertsModule,
    BlockchainIdaasModule,
  ],
})

export default App
