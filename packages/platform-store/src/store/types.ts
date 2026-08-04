import type { AuthSlice } from './slices/authSlice'
import type { GuestSlice } from './slices/guestSlice'
import type { ProfileSlice } from './slices/profileSlice'
import type { NotificationSlice } from './slices/notificationSlice'
import type { PreferencesSlice } from './slices/preferences/preferences'
import type { SettingsSlice, LayoutOverride } from './slices/settingsSlice'
import type { NavigationSlice } from './slices/navigationSlice'
import type { NetworkSlice } from './slices/networkSlice'
import type { OfflineQueueSlice } from './slices/offlineQueueSlice'

export type { LayoutOverride }

export type AppStore = AuthSlice &
  GuestSlice &
  ProfileSlice &
  NotificationSlice &
  PreferencesSlice &
  SettingsSlice &
  NavigationSlice &
  NetworkSlice &
  OfflineQueueSlice
