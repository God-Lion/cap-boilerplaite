# React + TypeScript + Vite Boilerplate

This project is a robust boilerplate built with **React**, **TypeScript**, and **Vite**, featuring a production-ready **Offline-First Sync Architecture**.

## 🚀 Features

- **Offline-First Architecture**: Seamlessly switches between online API and IndexedDB storage.
- **Auto-Sync**: Automatically queues offline operations and syncs when connection is restored.
- **Production Services**: Built-in **Logger** (structured logging) and **Notifications** (toast & system).
- **Type-Safe**: Full TypeScript support with shared type definitions.
- **Clean Code**: Adheres to SOLID principles and Clean Code practices.

---

## 📚 Production Services Documentation

### Logger Service

Structured logging with severity levels and context support.

```typescript
import { logger } from '@/services/core/logger.service'

// Log with different levels
logger.debug('Validation starting', { field: 'email' })
logger.info('User logged in', { userId: '123' })
logger.warn('Rate limit approaching')
logger.error('Payment failed', new Error('Insufficient funds'), {
  cartId: 'abc',
})
```

### Notification Service

Unified interface for Toast and Browser notifications.

```typescript
import { notificationService } from '@/services/core/notification.service'

// Show toast
notificationService.success('Profile updated!')
notificationService.error('Failed to save')

// Show system notification (browser)
await notificationService.showSystemNotification('New Message', {
  body: 'You have received a new message',
})
```

---

## 📚 Offline-First Sync Documentation

The offline capability is built around a central `SyncManager` that orchestrates data flow between your API and `IndexedDB`.

### Quick Start

Initialize the sync system in your root component (e.g., `App.tsx`):

```typescript
import { useEffect } from 'react'
import { appDB } from '@/services/storage/indexedDB.service'
import { syncManager } from '@/services/core/sync-manager.service'

function App() {
  useEffect(() => {
    // 1. Initialize Database
    appDB.init()

    // 2. Configure Sync (Optional)
    syncManager.configure({
      batchSize: 20,
      retryAttempts: 5,
    })
  }, [])

  return <YourApp />
}
```

### Core Hooks

#### `useOfflineQuery<T>(resource, id?, options?)`

Automatically fetches from API and caches when online, or reads from cache when offline.

```typescript
import { useOfflineQuery } from '@/hooks'

function UserList() {
  const { data, loading, isStale } = useOfflineQuery<User[]>('users')

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {isStale && <span>⚠️ Using cached data</span>}
      {data?.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  )
}
```

#### `useOfflineMutation<T, V>(operation, resource, options?)`

Performs mutations that sync immediately if online, or queue for later if offline.

```typescript
import { useOfflineMutation } from '@/hooks'
import { OperationType } from '@/types/sync.types'

function CreateUser() {
  const { mutate } = useOfflineMutation<User>(OperationType.CREATE, 'users')

  const handleCreate = async (userData) => {
    // Will auto-queue if offline!
    const result = await mutate(userData)

    if (result.synced) {
      console.log('Synced with server:', result.serverId)
    } else {
      console.log('Queued locally:', result.localId)
    }
  }
}
```

#### `useNetworkStatus()` and `useSyncStatus()`

Track connection and sync queue state.

```typescript
import { useNetworkStatus, useSyncStatus } from '@/hooks'

function StatusBar() {
  const { isOnline } = useNetworkStatus()
  const { pendingCount, isSyncing } = useSyncStatus()

  return (
    <div>
      Status: {isOnline ? '🟢 Online' : '🔴 Offline'}
      {pendingCount > 0 && ` | ⏳ ${pendingCount} pending`}
      {isSyncing && ' | 🔄 Syncing...'}
    </div>
  )
}
```

---

## 🛠 Project Structure

```
src/
├── hooks/
│   ├── core/         # Network & Sync status hooks
│   └── data/         # Offline-first data hooks
├── services/
│   ├── api/          # API Client
│   ├── core/         # Logger, Notification, Network, Queue services
│   ├── storage/      # IndexedDB wrapper
│   └── ...
├── types/            # Shared type definitions
└── ...
```

## 📜 Scripts

- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
