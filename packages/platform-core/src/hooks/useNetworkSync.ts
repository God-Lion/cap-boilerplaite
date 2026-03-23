import { useEffect } from 'react'
import { onlineManager } from '@tanstack/react-query'
import { useNetwork } from '../store'
import { refreshManager } from '../services/api/api.client'
import { replayOfflineQueue } from '../services/api/offline-sync.service'

export const useNetworkSync = () => {
  const { setOnline, setOffline } = useNetwork()

  useEffect(() => {
    const handleOnline = () => {
      setOnline()
      onlineManager.setOnline(true)
      refreshManager.resume()
      replayOfflineQueue()
    }

    const handleOffline = () => {
      setOffline()
      onlineManager.setOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial check
    if (window.navigator.onLine) {
      handleOnline()
    } else {
      handleOffline()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline, setOffline])
}
