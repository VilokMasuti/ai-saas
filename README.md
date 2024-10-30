# Image Playground

Image Playground is a web application that allows users to generate, edit, and manage AI-generated images. It provides a user-friendly interface for creating custom images based on text prompts and offers various editing options.

## Features

- Image generation based on text prompts
- Image editing capabilities (e.g., background removal, upscaling, captioning)
- User authentication and profile management
- Dashboard for managing generated and edited images
- Customizable image parameters (model, dimensions, seed, number of images)

## Tech Stack

- Next.js (React framework)
- Supabase (Backend and Authentication)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Custom UI components (Dropdown, Dialog, Select, etc.)

## Project Structure

The project is structured as follows:

- `pages/`: Contains the main pages of the application
  - `dashboard/`: Dashboard page for managing images
  - `canvas/[canvasId].tsx`: Individual canvas page for image generation and editing
- `components/`: Reusable React components
  - `Header.tsx`: Navigation header component
  - `Loading.tsx`: Loading indicator component
- `hooks/`: Custom React hooks
  - `useUser.ts`: Hook for managing user state
  - `use-toast.ts`: Hook for displaying toast notifications
- `utils/`: Utility functions and constants
- `public/`: Static assets (images, fonts, etc.)

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/your-username/image-playground.git
   cd image-playground
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Sign in or create an account
2. Navigate to the dashboard to view your existing images or create a new canvas
3. On the canvas page, enter a prompt and customize image parameters
4. Click "Generate Image" to create new images
5. Use the editing options to modify your generated images

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

