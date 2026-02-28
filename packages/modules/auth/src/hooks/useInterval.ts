import { useEffect, useRef } from 'react'

/**
 * Custom hook for declarative intervals in React.
 * Prevents issues with stale closures when used with state.
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
