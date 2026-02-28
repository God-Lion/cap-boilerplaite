import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/auth/auth.service'
import { USER_KEYS } from './useUser'

export const useAuth = () => {
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: () => {
      authService.loginWithIdaas()
      return Promise.resolve() // This never resolves effectively as we redirect
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData(USER_KEYS.me, null)
    },
  })

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}
