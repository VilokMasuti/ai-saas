'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Header from '../Header'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { useUser } from '../hooks/useUser'
import { supabase } from '../../supabse_client'
import { SparklesCore } from '../../components/ui/sparkles'
import { GlareCard } from '../../components/ui/glare-card'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [canvasItems, setCanvasItems] = useState([])
  const [user] = useUser()
  const router = useRouter()
  const id = uuidv4()
  const imagesSlase = [
    { name: 1, img: '/assest/r.jpg' },
    { name: 2, img: '/assest/photo_2024-10-27_19-21-20.jpg' },
    { name: 3, img: '/assest/photo_2024-10-27_19-21-21 (2).jpg' },
    { name: 4, img: '/assest/photo_2024-10-27_19-21-21 (3).jpg' },
    { name: 4, img: '/assest/photo_2024-10-27_19-21-21 (3).jpg' },
  ]
  const currentImage = imagesSlase[currentImageIndex] || {}
  const createNewCanvas = async () => {
    await supabase
      .from('canvas')
      .insert([{ canvas_id: id, user_id: user.id }])
      .select()
    router.replace(`/canvas/${id}`)
  }
  const fetchCanvas = async () => {
    const { data, error } = await supabase
      .from('canvas')
      .select()
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    setCanvasItems(data)
  }
  useEffect(() => {
    if (!user || !supabase) return
    fetchCanvas()
  }, [supabase, user])
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesSlase.length)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  return (
    <section className="bg-zinc-950 relative">
      <div className="h-screen w-full flex flex-col items-center justify-start">
        <div className="w-full absolute inset-0 h-screen z-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>

        <div className="z-20 bg-inherit w-full">
          <Header />
        </div>

        <div className="w-full flex items-center justify-end py-4 px-6 mt-4 z-20">
          <button
            onClick={createNewCanvas}
            className="P-text smooth cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-2"
          >
            + new canvas
          </button>
        </div>

        <div className="flex lg:flex-row gap-5  items-center   max-w-full overflow-x-auto min-h-[400px] space-x-4 p-4 lg:p-6 justify-center h-full z-10">
          {canvasItems.map((item, i) => (
            <Link
              href={`/canvas/${item.canvas_id}`}
              key={item.id}
              className="py-12 px-6 t relative flex-shrink-0 z-10"
            >
              <GlareCard className="relative smooth cursor-pointer w-full border-none ">
                <AnimatePresence>
                  {currentImage.img && (
                    <motion.div
                      key={currentImage.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }} // Adjust duration for smoothness
                      className="h-full w-full absolute inset-0"
                    >
                      <Image
                        src={currentImage.img}
                        alt={`Image ${currentImage.name}`}
                        className="h-full w-full object-cover"
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <p className="P-text text-center font-bold z-20 relative px-4 py-2">
                  canvas - {i + 1}
                </p>
              </GlareCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
