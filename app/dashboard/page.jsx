'use client'

// Import necessary dependencies and components
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Header from '../Header'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

// Import custom hooks and utilities
import  useUser  from '../hooks/useUser'
import { supabase } from '../../supabse_client'
import { GlareCard } from '../../components/ui/glare-card'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// Define the main DashboardPage component
export default function DashboardPage() {
  // Initialize state for canvas items and current image index
  const [canvasItems, setCanvasItems] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Use custom hook to get user data and initialize router
  const [user] = useUser()
  const router = useRouter()

  // Generate a unique ID for new canvases
  const id = uuidv4()

  // Define an array of image objects for the background slideshow
  const imagesSlase = [
    { name: 1, img: '/assest/r.jpg' },
    { name: 2, img: '/assest/l.jpg' },
    { name: 3, img: '/assest/b.jpg' },
    { name: 4, img: '/assest/ch.jpg' },
    { name: 5, img: '/assest/hum.jpg' },
    { name: 6, img: '/assest/wi.jpg' },
    { name: 7, img: '/assest/photo_2024-10-27_19-21-21 (3).jpg' },
    { name: 8, img: '/assest/t.jpg' },
    { name: 9, img: '/assest/photo_2024-10-27_19-21-21 (5).jpg' },
    { name: 10, img: '/assest/photo_2024-10-27_19-21-21 (4).jpg' },
  ]

  // Function to create a new canvas
  const createNewCanvas = async (event) => {
    // Prevent event propagation
    event.stopPropagation()
    try {
      // Insert new canvas data into Supabase
      const { data, error } = await supabase
        .from('canvas')
        .insert([{ canvas_id: id, user_id: user.id }])
        .select()
      // Throw error if insertion fails
      if (error) throw error
      // Redirect to the new canvas page
      router.replace(`/canvas/${id}`)
    } catch (error) {
      // Log error if canvas creation fails
      console.error('Error creating new canvas:', error)
    }
  }

  // Function to fetch existing canvases for the user
  const fetchCanvas = async () => {
    try {
      // Select canvas data from Supabase for the current user
      const { data, error } = await supabase
        .from('canvas')
        .select()
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      // Throw error if fetch fails
      if (error) throw error
      // Update state with fetched canvas items
      setCanvasItems(data)
    } catch (error) {
      // Log error if canvas fetch fails
      console.error('Error fetching canvas:', error)
    }
  }

  // Effect to fetch canvases when the component mounts or user changes
  useEffect(() => {
    // Only fetch if user and supabase are available
    if (!user || !supabase) return
    fetchCanvas()
  }, [supabase, user])

  // Effect to change background image every 5 seconds
  useEffect(() => {
    // Set up interval to change image
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesSlase.length)
    }, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  // Define animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.2 },
  }

  // Define transition settings for page animations
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  }

  // Define animation variants for card elements
  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    in: { y: 0, opacity: 1 },
    out: { y: -50, opacity: 0 },
  }

  // Define transition settings for card animations
  const cardTransition = {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  }

  // Render the dashboard page
  return (
    <motion.section
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="relative min-h-screen w-full overflow-hidden bg-zinc-950"
    >
      {/* Animated background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0 "
        >
          <Image
            src={imagesSlase[currentImageIndex].img}
            alt={`Background ${imagesSlase[currentImageIndex].name}`}
            layout="fill"
            quality={100}
          />
          <div className="absolute inset-0 bg-black opacity-50" />
        </motion.div>
      </AnimatePresence>

      {/* Main content container */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start">
        {/* Animated header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, ...cardTransition }}
        >
          <Header />
        </motion.div>

        {/* Animated "New Canvas" button container */}
        <motion.div
          className="mt-4 flex items-center justify-end px-6 py-4 "
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, ...cardTransition }}
        >
          {/* "New Canvas" button */}
          <button
            onClick={createNewCanvas}
            className="inline-flex h-12 font-spaceGrotesk text-center animate-shimmer items-center justify-center rounded-full border text-slate-700 border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            + new canvas
          </button>
        </motion.div>

        {/* Animated container for canvas items */}
        <motion.div
          className="flex h-full min-h-[400px] max-w-full items-center justify-center space-x-4 max-sm:overflow-x-auto p-4 lg:flex-row lg:p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, ...cardTransition }}
        >
          {/* Animate presence for smooth enter/exit animations */}
          <AnimatePresence>
            {/* Map through canvas items and create animated cards */}
            {canvasItems.map((item, i) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={{ delay: i * 0.1, ...cardTransition }}
              >
                {/* Link to individual canvas page */}
                <Link
                  href={`/canvas/${item.canvas_id}`}
                  className="relative flex-shrink-0 py-12 px-6"
                >
                  {/* GlareCard component for visual effect */}
                  <GlareCard className="relative smooth w-full cursor-pointer border-none overflow-hidden group">
                    {/* Animated background image for each card */}
                    <motion.div
                      className="absolute inset-0 h-full w-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={imagesSlase[currentImageIndex].img}
                        alt={`Image ${imagesSlase[currentImageIndex].name}`}
                        className="h-full w-full object-cover"
                        layout="fill"
                        quality={100}
                      />
                    </motion.div>

                    {/* Overlay for hover effect */}
                    <motion.div
                      className="absolute inset-0 z-10 bg-black bg-opacity-50"
                      whileHover={{ opacity: 0.7 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Canvas title */}
                    <motion.p
                      className="P-text relative z-20 px-4 py-2 animate-pulse duration-1000 text-center font-bold text-white"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      canvas - {i + 1}
                    </motion.p>
                  </GlareCard>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  )
}
