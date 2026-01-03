import { useAuth } from '@cap/platform-core'
import { useNavigate } from 'react-router-dom'

interface UseSignOutOptions {
  redirectTo?: string
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useSignOut = (options: UseSignOutOptions = {}) => {
  const { signOut: contextSignOut } = useAuth()
  const navigate = useNavigate()

  const signOut = () => {
    contextSignOut()
    options.onSuccess?.()
    if (options.redirectTo) {
      navigate(options.redirectTo)
    }
  }

  return {
    signOut,
    isSigningOut: false,
  }
}
