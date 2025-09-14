'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

import { useRouter } from 'next/navigation'


import { supabase } from '../supabse_client'
import useUser from './hooks/useUser'

export default function Header() {
  // Get the current user using a custom hook
  const [user] = useUser()

  // Initialize the Next.js router
  const router = useRouter()

  // Redirect to sign-in page if there's no user
  if (user == 'no user') router.replace('/sgin-in')

  // Function to handle user sign out
  const signOut = async () => {
    // Sign out the user using Supabase
    await supabase.auth.signOut()
    // Redirect to sign-in page after sign out
    router.push('/sgin-in')
  }

  return (
    <div className="w-full py-4 px-4 items-center justify-between flex space-x-2">
      {/* Logo and site title */}
      <Link
        href="dashboard"
        prefetch
        className="link uppercase cursor-pointer "
      >
        Image <b className="text-red-500 font-mono pl-1">Playground_</b>
      </Link>

      {/* User dropdown menu */}
      <DropdownMenu>
        {/* Dropdown trigger - displays user avatar and name */}
        <DropdownMenuTrigger>
          <div className="flex space-x-2 items-center justify-center">
            <img
              className="rounded-full h-6 w-6 self-center"
              src={user?.user_metadata?.picture}
              alt="User avatar"
            />
            <p className="label text-white">{user?.user_metadata?.name}</p>
          </div>
        </DropdownMenuTrigger>

        {/* Dropdown content */}
        <DropdownMenuContent className="bg-black flex flex-col gap-3 w-28 text-center text-white border-white/10">
          {/* Dashboard link */}
          <Link href={'/dashboard'}>
            <DropdownMenuItem className="ml-3 uppercase textC cursor-pointer font-bold">
              dashboard
            </DropdownMenuItem>
          </Link>

          {/* Usage link */}
          <Link href={'/usage'}>
            <DropdownMenuItem className="ml-3 uppercase textC cursor-pointer font-bold">
              usage
            </DropdownMenuItem>
          </Link>

          {/* Separator line */}
          <DropdownMenuSeparator className="bg-white/10" />

          {/* Logout option */}
          <DropdownMenuItem
            className="ml-3 bg-text cursor-pointer uppercase textC font-bold"
            onClick={signOut}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
