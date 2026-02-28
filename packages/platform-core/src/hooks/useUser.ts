import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user/user.service'
import { UserDto } from '@cap/shared-types'

export const USER_KEYS = {
  me: ['user', 'me'] as const,
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: USER_KEYS.me,
    queryFn: () => userService.getMe(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on 401 as it's handled by interceptor
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserDto>) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(USER_KEYS.me, updatedUser)
    },
  })
}
