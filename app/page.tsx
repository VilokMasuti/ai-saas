'use client'

import { useEffect, useRef } from 'react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { BackgroundLines } from '@/components/ui/background-lines'
import Link from 'next/link'
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { gsap } from 'gsap'

const Page = () => {
  const controls = useAnimation()
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-300, 300], [30, -30])
  const rotateY = useTransform(x, [-300, 300], [-30, 30])

  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 2 } },
  }

  return (
    <motion.section
      ref={containerRef}
      className="relative bg-zinc-950 h-screen overflow-hidden"
      initial="initial"
      animate="animate"
      variants={backgroundVariants}
    >
      <div className="text-7xl font-bold flex flex-col lg:pt-36 max-sm:mt-[53%] items-center justify-center">
        <TextHoverEffect text="V I L O K" />

        <motion.h2
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 3, delay: 3 }}
          className="text-3xl lg:text-8xl font-bold text-white absolute lg:pb-12 lg:pl-16 pb-4 pl-3 bg-text tracking-widest"
        >
          P R E S E N T S
        </motion.h2>
      </div>

      <Link
        href="/dashboard"
        className="absolute lg:bottom-10 lg:left-[45%] lg:top-[80%] top-[45%] left-[32%] cursor-pointer flex"
      >
        <motion.button
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 3, delay: 3 }}
          className="inline-flex h-12 text-center animate-shimmer items-center justify-center rounded-full border text-slate-700 border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          DASHBOARD
        </motion.button>
      </Link>

      <ParticleEffect />
    </motion.section>
  )
}

const ParticleEffect = () => {
  const particleCount = 100
  const areaWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
  const areaHeight = typeof window !== 'undefined' ? window.innerHeight : 1000

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    x: Math.random() * areaWidth,
    y: Math.random() * areaHeight,
    size: Math.random() * 3 + 1,
    color: ['#FF69B4', '#00CED1', '#FF6347', '#7B68EE'][
      Math.floor(Math.random() * 4)
    ],
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            x: [particle.x, particle.x + (Math.random() - 0.5) * 100],
            y: [particle.y, particle.y + (Math.random() - 0.5) * 100],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default Page
