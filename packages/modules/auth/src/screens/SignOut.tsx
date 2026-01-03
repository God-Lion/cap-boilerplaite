import React from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@cap/platform-core'

export default function SignOut() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const forward = location.state?.forward ?? '/'

  React.useEffect(() => {
    signOut((status: number) => {
      if (status === 200) navigate(`${forward ?? '/'}`)
    })
  }, [signOut, navigate, forward])

  return <Navigate to={forward} />
}
