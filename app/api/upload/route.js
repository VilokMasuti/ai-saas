import { supabase } from '../../../supabse_client.js'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const canvasId = formData.get('canvas')
    const userId = formData.get('userId')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL of the uploaded file
    const { data: urlData, error: urlError } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    if (urlError) {
      throw urlError
    }

    // Insert image information into the database
    const { error: dbError } = await supabase.from('images_created').insert([
      {
        canvas_id: canvasId,
        url: urlData.publicUrl,
        prompt: 'Uploaded image',
        filter: 'none',
        user_id: userId,
        type: 'uploaded',
      },
    ])

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({ success: true, url: urlData.publicUrl })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
