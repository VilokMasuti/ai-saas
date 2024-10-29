'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import Header from '../Header'
import { useUser } from '../hooks/useUser'
import { supabase } from '@/supabse_client'
import { Progress } from '@/components/ui/progress'

const Usagepage = () => {
  const router = useRouter()
  const [user] = useUser()
  if (user == 'no user') router.push('/auth/sgin-in')
  const [imagesUsage, setImagesUsage] = useState({
    created: 0,
    edited: 0,
  })
  const feacthImagesUsage = async () => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    const thirtyDaysAgoISOString = thirtyDaysAgo.toISOString()
    const [createImgs, editedImgs] = await Promise.all([
      supabase
        .from('images_created')
        .select()
        .eq('user_id', user?.id)
        .gte('created_at', thirtyDaysAgoISOString),
      supabase
        .from('images_edited')
        .select()
        .eq('user_id', user?.id)
        .gte('created_at', thirtyDaysAgoISOString),
    ])
    setImagesUsage({
      created: createImgs.data.length,
      edited: editedImgs.data.length,
    })
  }

  useEffect(() => {
    if (!supabase || user == 'no user' || !user) return
    feacthImagesUsage()
  }, [supabase, user])

  return (
    <div className=" max-h-screen w-full items-center justify-start P-text flex flex-col">
      <Header />
      <div
        className=" min-h-[50vh] items-center justify-start flex flex-col
            rounded-lg w-3/4 lg:w-1/2 my-6 py-6 px-6"
      >
        <p className="border-b border-black/10 w-full pb-4 font-bold">
          {' '}
          usage in the last 30 days{' '}
        </p>
        <span className="w-full flex items-center justify-between mt-12">
          <p className="w-1/2"> Images generated</p>
          <span className="w-full flex items-center justify-end space-x-2">
            {/* progress */}
            <Progress
              value={(imagesUsage.created / 30) * 100}
              className="progress"
            />
            <p>{imagesUsage.created}/30</p>
          </span>
        </span>
        <span className="w-full flex items-center justify-between mt-12">
          <p className="w-1/2"> Images Edited</p>
          <span className="w-full flex items-center justify-end space-x-2">
            {/* progress */}
            <Progress
              value={(imagesUsage.edited / 30) * 100}
              className="progress"
            />
            <p>{imagesUsage.edited}/30</p>
          </span>
        </span>
      </div>
    </div>
  )
}

export default Usagepage
