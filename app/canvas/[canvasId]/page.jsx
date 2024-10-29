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
import { DownloadIcon, ShadowOuterIcon } from '@radix-ui/react-icons'
import { SparklesCore } from '../../../components/ui/sparkles'

const Page = () => {
  // Initial default parameters for image generation
  let initialParams = {
    filter: filters[0].value,
    model: models[1].version,
    dimension: dimensions[1],
    seed: 0,
    number: 1,
  }

  // Component state variables
  const [editedImages, setEditedImages] = useState([]) // Stores images edited by the user
  const [OpenDialog, setOpenDialog] = useState(false) // Controls the open state of the image edit dialog
  const [prompt, setPrompt] = useState('') // User prompt for image generation
  const [loading, setLoading] = useState(false) // Loading indicator for image fetching
  const [selectedImage, setSelectedImage] = useState('') // Tracks the currently selected image
  const { toast } = useToast() // Toast notification handler
  const [createdImages, setCreatedImages] = useState([]) // List of generated images
  const [imageParams, setImageParams] = useState(initialParams) // Params for image customization
  const { canvasId } = useParams() // Canvas ID parameter from URL
  const [editingCommand, setEditingCommand] = useState('Remove Background') // Selected editing command for image
  const [loadingEditing, setLoadingEditing] = useState(false) // Loading state for image editing commands
  const [user] = useUser() // Current user data

  // Function to initiate image generation based on user input and selected parameters
  const generateImages = async () => {
    // Check if prompt is empty before proceeding
    if (!prompt || prompt.trim() === '') {
      toast({
        variant: 'outline',
        className: 'bg-white text-black',
        title: 'Uh oh! Something went wrong.',
        description: 'Please enter a valid prompt to generate images.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      return
    }

    // Create payload with user data, prompt, and selected parameters
    let payload = {
      prompt,
      imageParams,
      canvas: canvasId,
      userId: user.id,
    }

    try {
      // API call to backend to generate image(s)
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res && res.ok) {
        toast({
          title: 'Success!',
          description: 'Your image has been generated.',
        })
        setPrompt('') // Clear prompt input after successful generation
        setImageParams(intialParams) // Reset parameters to default
      }
    } catch (error) {
      console.error('Error generating images:', error)
    } finally {
      setTimeout(() => {
        fetchCreatedImages()
      }, 3000)
    }
  }

  const fetchCreatedImages = async () => {
    setLoading(true) // Set loading state to true during fetch operation

    try {
      const [
        { data: images, error: imagesError },
        { data: editedImgs, error: editedImgsError },
      ] = await Promise.all([
        supabase
          .from('images_created')
          .select()
          .eq('canvas_id', canvasId)
          .order('created_at', { ascending: false }),
        supabase
          .from('images_edited')
          .select()
          .eq('canvas_id', canvasId)
          .order('created_at', { ascending: false }),
      ])

      // Handle potential errors from Supabase queries
      if (imagesError || editedImgsError) {
        console.error('Error fetching images:', imagesError || editedImgsError)
        return
      }

      setCreatedImages(images || []) // Set fetched data, default to empty array if null
      setEditedImages(editedImgs || [])
      setPrompt('') // Clear prompt input post-fetch
      setImageParams(initialParams) // Reset parameters to default
    } catch (error) {
      console.error('Error during fetch:', error) // Log unexpected errors
    } finally {
      setLoading(false) // Set loading state to false after operation
    }
  }

  // useEffect hook to automatically fetch images on component mount or when canvasId changes
  useEffect(() => {
    if (!supabase || !canvasId) return
    fetchCreatedImages()
  }, [supabase, canvasId])

  // Function to edit  previously generated images

  const editImage = async () => {
    if (!selectedImage || loadingEditing) return
    setLoadingEditing(true) // Set loading state to true during edit operation
    let payload = {
      imageUrl: selectedImage.url,
      command: editingCommand,
      canvas: canvasId,
      userId: user.id,
    }
    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (res && res.ok) {
        toast({
          variant: 'outline',
          className: 'bg-white text-black',
          title: 'Success!',
          description: 'Your image has been edited.',
        })
      }
    } catch (error) {
      console.error('Error generating images:', error)
      toast({
        variant: 'outline',
        className: 'bg-white text-black',
        title: 'Editing Error',
        description: 'There was an issue editing your image. Please try again.',
      })
    } finally {
      setOpenDialog(false)
      setLoadingEditing(false)
      setTimeout(() => {
        fetchCreatedImages()
      }, 2000)
    }
  }

  return (
    <section className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center w-full text-white Border">
      <Header />

      <div className="lg:grid lg:grid-cols-5 flex flex-col gap-3 bg-zinc-950 w-full min-h-screen Border">
        {/* Filter Section */}
        <div className="col-span-1 overflow-y-auto py-12 px-6 space-y-6 Border p-4">
          <div>
            <h3 className="textC H3-text">Filter</h3>
            <p className="P-text">
              Experiment with different styles for your image.
            </p>
            <Select>
              <SelectTrigger className="w-[180px] textC lg:ml-[10%] ml-24 md:ml-28 ">
                <SelectValue placeholder="none" />
              </SelectTrigger>
              <SelectContent className="  bg-black lg:ml-[-10%] ml-[-10%] md:ml-[-10%] ">
                {filters.map((filter) => (
                  <SelectItem
                    key={filter.value}
                    value={filter.value}
                    className="textC font-bold text-center cursor-pointer"
                  >
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="Border animate-pulse duration-1000 w-full "></p>

          {/* Prompt Input Section */}
          <div>
            <h3 className="H3-text textC">Prompt</h3>
            <p className="P-text">
              Describe what you want to see in your image.
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black Border Border-white/10 py-6 px-6 text-white smooth w-[99%] h-[30vh]"
            />
          </div>

          {/* Generate Button */}
          <div className="w-full items-center justify-center flex">
            <button
              onClick={generateImages}
              className="inline-flex h-12 text-center  outline-none animate-shimmer items-center gap-2 justify-center rounded-full border text-slate-700 border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium transition-colors "
            >
              {loading ? 'Loading...' : 'Generate Image'}
              <span className="animate-spin duration-1000">🪄</span>
            </button>
          </div>
        </div>

        {/* Image Display Section */}
        <div className="col-span-3 p-4 flex  flex-col gap-11 items-center justify-start w-full min-h-screen   pt-12 relative ">
          {selectedImage && (
            <div className="w-full flex items-center justify-between absolute top-5 ">
              {/* Image Options Dialog */}
              <div className="textC items-center justify-start flex space-x-3 ">
                <Link
                  href={selectedImage.url}
                  target="_blank"
                  className="label"
                >
                  <DownloadIcon className="w-6 h-6 text-white/50 hover:text-white cursor-pointer" />
                </Link>
                <Dialog open={OpenDialog}>
                  <DialogTrigger
                    onClick={() => setOpenDialog(true)}
                    className=""
                  >
                    ⚙️
                  </DialogTrigger>
                  <DialogContent
                    onInteractOutside={() => setOpenDialog(false)}
                    className="bg-black text-white py-12 filter backdrop-blur-lg bg-opacity-40 Border border-white/20"
                  >
                    <DialogHeader>
                      <DialogTitle className="P-text">Edit Options</DialogTitle>
                      <DialogDescription className="w-full items-center justify-center flex flex-col space-y-10">
                        <div
                          className="w-full py-6 max-h-[40vh]
                                        overflow-y-auto"
                        >
                          {/* List of Editing Commands */}
                          {/* Remove Background */}
                          <div
                            onClick={() =>
                              setEditingCommand('Remove Background')
                            }
                            className={`editing_command ${
                              editingCommand === 'Remove Background'
                                ? 'border-white text-white bg-white/5'
                                : 'border-white/10'
                            }`}
                          >
                            <p>Remove Background</p>
                          </div>
                          {/* Additional editing options... */}
                          {/* upscale */}
                          <div
                            onClick={() => setEditingCommand('upscale')}
                            className={`editing_command
                                                        ${
                                                          editingCommand ==
                                                          'upscale'
                                                            ? 'border-white text-white bg-white/5'
                                                            : 'border-white/10'
                                                        }`}
                          >
                            <p>upscale</p>
                            {editingCommand == 'upscale' && (
                              <p
                                className="text-xs italic
                                                                smooth text-white/20"
                              >
                                create higher-quality image from this image
                              </p>
                            )}
                          </div>
                          {/* caption */}
                          <div
                            onClick={() => setEditingCommand('captionize')}
                            className={`editing_command
                                                        ${
                                                          editingCommand ==
                                                          'captionize'
                                                            ? 'border-white text-white bg-white/5'
                                                            : 'border-white/10'
                                                        }`}
                          >
                            <p>captionize</p>
                            {editingCommand == 'captionize' && (
                              <p
                                className="text-xs italic smooth
                                                                 text-white/20"
                              >
                                generate detailed caption for this images
                              </p>
                            )}
                          </div>
                          {/* restore ai_face */}
                          <div
                            onClick={() => setEditingCommand('restore faces')}
                            className={`editing_command
                                                        ${
                                                          editingCommand ==
                                                          'restore faces'
                                                            ? 'border-white text-white bg-white/5'
                                                            : 'border-white/10'
                                                        }`}
                          >
                            <p>restore faces</p>
                            {editingCommand == 'restore faces' && (
                              <p
                                className="text-xs italic smooth
                                                            text-white/20"
                              >
                                face restoration for any AI-generated faces in
                                this image
                              </p>
                            )}
                          </div>
                          {/* restore old_photo */}
                          <div
                            onClick={() =>
                              setEditingCommand('restore old photo')
                            }
                            className={`editing_command
                                                        ${
                                                          editingCommand ==
                                                          'restore old photo'
                                                            ? 'border-white text-white bg-white/5'
                                                            : 'border-white/10'
                                                        }`}
                          >
                            <p>restore old photo</p>
                            {editingCommand == 'restore old photo' && (
                              <p
                                className="text-xs italic smooth
                                                            text-white/20"
                              >
                                bring your old photos back to life
                              </p>
                            )}
                          </div>
                        </div>

                        <button className="button" onClick={editImage}>
                          {loadingEditing ? 'Loading...' : editingCommand}
                        </button>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <p
                className="P-text lg:ml-[90%] ml-[78%]  cursor-pointer"
                onClick={() => setSelectedImage('')}
              >
                <span className="w-10 h-10 text-white/50  cursor-pointer">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </p>
            </div>
          )}

          {/* Display created images */}
          <div className="w-full mt-[10%] flex items-center justify-start max-w-full Border overflow-x-scroll min-h-[400px] space-x-4 p-6">
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
          <div
            className="items-center justify-start flex max-w-[100%]
                 overflow-x-scroll min-h-[400px] space-x-4 p-6"
          >
            {editedImages.map((image) =>
              image.url ? (
                <div key={image.id} className="relative">
                  {!image.caption ? (
                    <Image
                      src={image.url}
                      alt={image.alt || 'Image'}
                      width={500}
                      height={500}
                      onClick={() => {
                        setSelectedImage(image)
                        setPrompt(image.prompt)
                        setImageParams((curr) => ({
                          ...curr,
                          model: models[2].version,
                        }))
                      }}
                      className="w-[300px] h-[300px] cursor-pointer hover:opacity-50 smooth object-center object-contain border border-white/20"
                    />
                  ) : (
                    <div className="text-white py-12 min-w-[300px] min-h-[300px] items-center justify-center flex border border-white/20 px-6 relative">
                      <p className="w-full P-text   text-center">
                        {image.caption}
                      </p>
                      <Image
                        alt="Image"
                        src={image.url}
                        width={300}
                        height={300}
                        className="absolute w-full h-full z-0 opacity-10"
                      />
                    </div>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Image Parameters Section */}
        <div
          className="col-span-1 flex
         flex-col gap-10 overflow-y-auto py-12 px-6 space-y-6 Border"
        >
          {/* Model selection */}
          <div>
            <h3 className="H3-text textC">Model</h3>
            <Select
              value={imageParams.model}
              onValueChange={(value) =>
                setImageParams((prev) => ({ ...prev, model: value }))
              }
            >
              <SelectTrigger className="w-[180px] bg-black  text-white  lg:ml-8 ml-[25%] md:ml-28 ">
                <SelectValue placeholder="none" />
              </SelectTrigger>

              <SelectContent className=" bg-black  outline-none  font-bold lg:ml-[-14%]">
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

          {/* Image dimensions selection */}
          <div className="">
            <h3 className="H-text textC  pt-[-10%]">Image dimensions</h3>
            <p className="P-text">Width X Height of the image</p>
            <div className="grid grid-cols-2  gap-3">
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
          {/* Seed input */}
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
              className=" py-1 outline-none px-2 Border lg:ml-8 ml-[25%] md:ml-28 textC   text-center"
            />
          </div>

          {/* Number of images selection */}
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
