import { GoogleGenAI, Modality } from '@google/genai'
import type { CollectionBeforeChangeHook } from 'payload'

const STYLIZE_PROMPT = `Transform this photo into a codename pictures-inspired cartoon portrait. 
Requirements:
- Crop and reframe to show ONLY head and shoulders, filling the entire frame with no margins or blank space
- The portrait must occupy 100% of the image canvas, edge to edge
- Low quality cartoon render with black and white aesthetic
- Pure white background behind the subject
- If text, remove any text from the image
- Stylized expressive eyes while keeping highly recognizable facial features
- Square 1:1 aspect ratio output`

export const stylizeMediaHook: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  // Only process new uploads
  if (operation !== 'create') {
    return data
  }

  // Check if there's a file being uploaded
  const file = req.file
  if (!file?.data) {
    return data
  }

  // Only process image files
  const mimeType = file.mimetype
  if (!mimeType?.startsWith('image/')) {
    return data
  }

  try {
    console.log('Stylizing uploaded image...')

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set')
    }

    // Convert buffer to base64
    const base64Image = file.data.toString('base64')

    // Initialize Google GenAI client
    const client = new GoogleGenAI({ apiKey })

    // Generate stylized image using Gemini 2.5 Flash Image model
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            {
              text: STYLIZE_PROMPT,
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    })

    // Extract the generated image from response
    const parts = response.candidates?.[0]?.content?.parts
    const imagePart = parts?.find((part: { inlineData?: { mimeType?: string } }) =>
      part.inlineData?.mimeType?.startsWith('image/'),
    )

    if (!imagePart?.inlineData?.data) {
      throw new Error('No image returned from Gemini')
    }

    // Replace the file data with stylized image
    const stylizedBuffer = Buffer.from(imagePart.inlineData.data, 'base64')

    file.data = stylizedBuffer
    file.size = stylizedBuffer.length
    file.mimetype = imagePart.inlineData.mimeType || 'image/png'
    file.name = file.name?.replace(/\.[^.]+$/, '.png') || 'stylized.png'

    console.log('Image stylized successfully')
  } catch (error) {
    console.error('Failed to stylize image:', error)
    throw new Error(
      `Failed to generate stylized image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  return data
}
