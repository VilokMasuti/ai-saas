'use client'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { BackgroundLines } from '@/components/ui/background-lines'
import Link from 'next/link'
import { motion } from 'framer-motion'
const Page = () => {
  return (
    <section className=" relative bg-zinc-950 ">
      <BackgroundLines className="bg-black h-screen flex flex-col relative overflow-hidden">
        <div className="text-7xl font-bold flex flex-col lg:pt-36 max-sm:mt-[53%] items-center justify-center">
          <TextHoverEffect text="V I L O K" />

          <motion.h2
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 3, delay: 3 }}
            className="text-3xl lg:text-8xl font-bold textC  absolute lg:pb-12 lg:pl-16 pb-4 pl-3 bg-text tracking-widest"
          >
            P R E S E N T S
          </motion.h2>
        </div>
      </BackgroundLines>
      <Link
        href="/dashboard"
        className="absolute lg:bottom-10  lg:left-[45%] lg:top-[80%] top-[45%] left-[32%]  cursor-pointer flex"
      >
        <motion.button
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 3, delay: 3 }}
          className="inline-flex h-12 text-center animate-shimmer items-center justify-center rounded-full border text-slate-700 border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium   transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          DASHBOARD
        </motion.button>
      </Link>
    </section>
  )
}

export default Page
