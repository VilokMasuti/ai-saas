'use client'

import { supabase } from '@/supabse_client'
import { ShootingStars } from '../../components/ui/shooting-stars'
import { StarsBackground } from '../../components/ui/stars-background'

export default function SigninPage() {
  const signInUser = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center w-full  relative">
      <div className="z-10  max-sm:mt-[-50%]">
        <div>
          <h1 className="text-2xl  font-spaceGrotesk md:text-4xl lg:text-6xl uppercase font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50  to-neutral-950 ">
            Build amazing creations <br /> at your AI Playground ⋆˚✿˖°
          </h1>
        </div>
        <button
          onClick={signInUser}
          className="  bg-slate-50  text-black shadow-lg uppercase  font-semibold px-4 py-2 rounded-lg   focus:outline-none cursor-pointer lg:ml-[36%] ml-[20%]"
        >
          Sign in with Google
        </button>
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  )
}
