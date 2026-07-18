import { useEffect, useState, useCallback, useRef } from 'react'

interface SSEOptions {
  onMessage?: (data: any) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  maxRetries?: number
  initialRetryInterval?: number
  enabled?: boolean
}

/**
 * A generic hook for subscribing to Server-Sent Events (SSE).
 * Handles connection management, automatic reconnection with exponential backoff,
 * and message parsing.
 */
export function useSSESubscription<TData = any>(url: string, options: SSEOptions = {}) {
  const {
    onMessage,
    onError,
    onOpen,
    maxRetries = 3,
    initialRetryInterval = 1000,
    enabled = true,
  } = options

  const [data, setData] = useState<TData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Event | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [prevUrl, setPrevUrl] = useState(url)

  // Reset retry count during render if the URL changes
  if (url !== prevUrl) {
    setPrevUrl(url)
    setRetryCount(0)
  }

  const eventSourceRef = useRef<EventSource | null>(null)
  const retryTimeoutRef = useRef<any>(null)

  // Use refs for callbacks to avoid unnecessary re-connections if callbacks aren't memoized
  const onMessageRef = useRef(onMessage)
  const onErrorRef = useRef(onError)
  const onOpenRef = useRef(onOpen)

  useEffect(() => {
    onMessageRef.current = onMessage
    onErrorRef.current = onError
    onOpenRef.current = onOpen
  }, [onMessage, onError, onOpen])

  useEffect(() => {
    if (!enabled) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      return
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const es = new EventSource(url, { withCredentials: true })
    eventSourceRef.current = es

    es.onopen = () => {
      setIsConnected(true)
      setError(null)
      setRetryCount(0)
      onOpenRef.current?.()
    }

    es.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        setData(parsedData)
        onMessageRef.current?.(parsedData)
      } catch (err) {
        console.error('Failed to parse SSE message', { error: err, rawData: event.data })
      }
    }

    es.onerror = (err) => {
      setIsConnected(false)
      setError(err)
      onErrorRef.current?.(err)
      es.close()

      // Handle reconnection with exponential backoff
      if (retryCount < maxRetries) {
        const interval = initialRetryInterval * Math.pow(2, retryCount)
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount((prev) => prev + 1)
        }, interval)
      }
    }

    return () => {
      es.close()
      setIsConnected(false)
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [url, maxRetries, initialRetryInterval, retryCount, enabled])

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    setIsConnected(false)
  }, [])

  return { data, isConnected, error, close }
}
