'use client'
import { supabase } from '../../supabse_client.js'
import { useEffect, useState } from 'react'

export default function useUser() {

  const [currentUser, setCurrentUser] = useState()
  const catchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setCurrentUser(user ?? 'no user')
  }
  useEffect(() => {
    if (!supabase) return
    catchUser()
  }, [supabase])
  return [currentUser]
}
