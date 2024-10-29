'use client'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { redirect, useRouter } from 'next/navigation'

import { useUser } from './hooks/useUser'
import { supabase } from '../supabse_client'

export default function Header() {
  const [user] = useUser()
  const router = useRouter()
  if (user == 'no user') router.replace('/sgin-in')

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/sgin-in')
  }
  return (
    <div
      className="  w-full
        py-4 px-4 items-center justify-between flex space-x-2"
    >
      {/* logo */}
      <Link
        href="dashboard"
        prefetch
        className="link uppercase cursor-pointer "
      >
        Image <b className=" text-red-500 font-mono pl-1">Playground_</b>
      </Link>
      {/* dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex space-x-2 items-center justify-center">
            <img
              className="rounded-full h-6 w-6 self-center"
              src={user?.user_metadata?.picture}
            />
            <p className="label text-white">{user?.user_metadata?.name}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black flex flex-col gap-3 w-28 text-center text-white border-white/10">
          <Link href={'/dashboard'}>
            <DropdownMenuItem className=" ml-3 uppercase  textC  cursor-pointer font-bold">
              dashboard
            </DropdownMenuItem>
          </Link>
          <Link href={'/usage'}>
            <DropdownMenuItem className=" ml-3 uppercase textC  cursor-pointer font-bold">
              usage
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator className="bg-white/10 " />
          <DropdownMenuItem
            className=" ml-3 bg-text cursor-pointer uppercase textC  font-bold"
            onClick={signOut}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
