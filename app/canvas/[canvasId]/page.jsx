'use client'
import React, { useEffect, useState } from 'react'
import Header from '../../Header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  dimensions,
  filters,
  imagesNumbers,
  models,
} from '../../../utils/utiles.js'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { useParams } from 'next/navigation'
import { useUser } from '../../hooks/useUser'
import Link from 'next/link'
import Image from 'next/image'
import Loading from '../../Loading/Loading'

import { supabase } from '../../../supabse_client'

const Page = () => {
  let intialParams = {
    filter: filters[0].value,
    model: models[1].version,
    dimension: dimensions[1],
    seed: 0,
    number: 1,
  }
  const [OpenDialog, setOpenDialog] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const { toast } = useToast()
  const [createdImages, setCreatedImages] = useState([])
  const [imageParams, setImageParams] = useState(intialParams)
  const { canvasId } = useParams()
  const [user] = useUser()
  const generateImages = async () => {
    if (!prompt || prompt.trim() === '') {
      toast({
        variant: 'outline',
        className: 'bg-white text-black',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      return
    }

    const payload = {
      prompt,
      imageParams,
      canvas: canvasId,
      userId: user.id,
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Your image has been generated.',
        })
        setPrompt('')
        setImageParams(intialParams)
      }
    } catch (error) {
      console.error('Error generating images:', error)
      toast({
        variant: 'outline',
        className: 'bg-white text-black',
        title: 'Generation Error',
        description:
          'There was an issue creating your image. Please try again.',
      })
    }
  }

  const fetchCreatedImages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('images_created')
      .select()
      .eq('canvas_id', canvasId)
      .order('created_at', { ascending: false })
    setCreatedImages(data)

    setLoading(false)
    setPrompt('')
    setImageParams(intialParams)
  }

  useEffect(() => {
    if (!supabase || !canvasId) return
    fetchCreatedImages()
  }, [supabase, canvasId])

  return (
    <section className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center w-full text-white Border">
      <Header />
      <div className="lg:grid lg:grid-cols-5 flex flex-col gap-3  bg-zinc-950 w-full min-h-screen Border">
        {/* Filter */}
        <div className="col-span-1 overflow-y-auto py-12 px-6 space-y-6 Border p-4">
          <div>
            <h3 className="textC  H3-text">Filter</h3>
            <p className="P-text ">
              Experiment with different styles that can be applied to your
              image..
            </p>
            <Select>
              <SelectTrigger className="w-[180px] textC lg:ml-[10%]   ml-24 md:ml-28 ">
                <SelectValue placeholder="none" />
              </SelectTrigger>
              <SelectContent className=" bg-red-500 textC lg:ml-[-10%]  ml-[-10%] md:ml-[-10%] ">
                {filters.map((filter) => (
                  <SelectItem
                    key={filter}
                    value={filter.value}
                    className="textC  font-bold text-center cursor-pointer"
                  >
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="Border animate-pulse duration-1000 w-full "></p>
          <div>
            <h3 className="H3-text textC">Prompt</h3>
            <p className="P-text">
              What do you want to see? You can use a single word or a full
              sentence.
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black Border Border-white/1O
                     py-6 px-6 text-white smooth w-[99%] h-[30vh] "
            />
          </div>
          <div className="w-full items-center justify-center flex">
            <button
              onClick={generateImages}
              className="inline-flex h-12 text-center animate-shimmer items-center gap-2
             justify-center rounded-full border text-slate-700 border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium   transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Generate <span className="  animate-spin duration-1000">🪄</span>
            </button>
          </div>
        </div>

        {/* Images */}
        <div
          className="col-span-3 p-4 flex
         items-center justify-start w-full min-h-screen border-x
          pt-12 relative  border-white/20"
        >
          {selectedImage && (
            <div className=" w-full flex  items-center  justify-between absolute top-5 ">
              <div className="textC    items-center justify-start flex space-x-3 ">
                <Link
                  href={selectedImage.url}
                  target="_blank"
                  className="label"
                >
                  Download
                </Link>
                <Dialog open={OpenDialog}>
                  <DialogTrigger onClick={() => setOpenDialog(true)}>
                    Edit
                  </DialogTrigger>
                  <DialogContent
                    onInteractOutside={() => setOpenDialog(false)}
                    className="bg-black text-white py-12 filter backdrop-blur-lg bg-opacity-40 Border border-white/20"
                  >
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <p
                className="P-text lg:ml-[60%] ml-[75%] pt-1 cursor-pointer"
                onClick={() => setSelectedImage('')}
              >
                X
              </p>
            </div>
          )}

          <div className="w-full mt-[-10%] flex items-center justify-start max-w-full Border overflow-x-scroll min-h-[400px] space-x-4 p-6">
            {loading ? (
              <Loading />
            ) : (
              createdImages.map((image, index) => (
                <Image
                  onClick={() => {
                    setSelectedImage(image)
                    setPrompt(image.prompt)
                    setImageParams((pre) => ({
                      ...pre,
                      model: models[2].version,
                    }))
                  }}
                  src={image.url}
                  key={`${image.id}-${index}`}
                  alt={image.prompt}
                  width={500}
                  height={500}
                  className={`w-[300px] h-[300px] object-center smooth cursor-pointer
                    object-contain border border-white/20 hover:opacity-50 ${
                      image.url === selectedImage.url && 'opacity-50'
                    }
                    `}
                />
              ))
            )}
          </div>
        </div>

        {/* Images Parameter */}
        <div
          className="col-span-1 flex
         flex-col gap-10 overflow-y-auto py-12 px-6 space-y-6 Border"
        >
          <div>
            <h3 className="H3-text textC">Model</h3>
            <Select
              value={imageParams.model}
              onValueChange={(value) =>
                setImageParams((prev) => ({ ...prev, model: value }))
              }
            >
              <SelectTrigger className="w-[180px] bg-black  text-white  lg:ml-8 ml-[30%] md:ml-28 ">
                <SelectValue placeholder="none" />
              </SelectTrigger>

              <SelectContent className=" bg-black  textC font-bold lg:ml-[-14%]">
                {models.map((model, index) => (
                  <SelectItem
                    key={index}
                    value={model.version}
                    className="textC  font-bold text-center cursor-pointer"
                  >
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <h3 className="H-text textC  pt-[-15%]">Image dimensions</h3>
            <p className="P-text">Width X Height of the image</p>
            <div className="grid grid-cols-2 gap-3">
              {dimensions.map((dimension) => (
                <div
                  onClick={() =>
                    setImageParams((prev) => ({ ...prev, dimension }))
                  }
                  key={dimension.width}
                  className={`text-sm px-4 py-1 border border-white/10
                             items-center justify-center smooth flex cursor-pointer
                             hover:text-black hover:bg-white/50    ${
                               imageParams.dimension.height ==
                                 dimension.height &&
                               imageParams.dimension.width == dimension.width
                                 ? 'bg-white text-black smooth'
                                 : ''
                             }
                             `}
                >
                  {`${dimension.width}X${dimension.height}`}
                </div>
              ))}
            </div>
          </div>
          <div className="border-b border-white/10 w-full pb-10">
            <h3 className="textC H-text">Seed</h3>
            <p className="P-text">
              Different numbers result in new variations of your image.
            </p>
            <input
              value={imageParams.seed}
              onChange={(e) =>
                setImageParams((curr) => ({
                  ...curr,
                  seed: parseInt(e.target.value),
                }))
              }
              type="number"
              placeholder="0"
              min={0}
              className="bg-black py-1 px-2 Border lg:ml-8 ml-[30%] md:ml-28 textC   text-center"
            />
          </div>

          <div className="w-full pb-10">
            <h3 className="textC H-text ">Number of Images</h3>
            <p className="P-text">
              Select the number of images you would like to generate.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {imagesNumbers.map((number) => (
                <div
                  key={number}
                  onClick={() =>
                    setImageParams((curr) => ({ ...curr, number: number.name }))
                  }
                  className={`text-sm text-C px-1 border border-white/10 items-center justify-center
                                flex hover:bg-white/50 smooth cursor-pointer ${
                                  imageParams.number == number.name &&
                                  'bg-white text-black smooth'
                                }
                                `}
                >
                  {number.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page
