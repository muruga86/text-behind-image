# Text Behind Image

A web application for creating dynamic visual designs by placing text behind transparent or semi-transparent images. This tool helps create depth and dimension in your designs by seamlessly integrating text and images.

## Features

- **Background Removal**: Automatically removes image backgrounds using AI (powered by [@imgly/background-removal](https://github.com/imgly/background-removal))
- **Text Customization**:
  - Position text elements anywhere behind your image
  - Adjust font family, size, color, rotation
  - Control text opacity and letter spacing
- **Live Preview**: See changes instantly as you adjust text properties
- **Download**: Export your design as a high-quality PNG image

## Tech Stack

- **Framework**: Next.js
- **UI Components**:
  - [Radix UI](https://www.radix-ui.com/) primitives
  - [shadcn/ui](https://ui.shadcn.com/) components
  - [Tailwind CSS](https://tailwindcss.com/) for styling
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) and [Geist](https://vercel.com/fonts/geist)
- **Theme**: Light/dark mode support via [next-themes](https://github.com/pacocoursey/next-themes)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/DevishMittal/text-behind-image.git
   cd text-behind-image
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the development server:
   ```sh
   npm run dev  # or yarn dev
   ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Upload an image by clicking the **"Upload Image"** button
2. Wait for the background removal process to complete
3. Click **"Add Text"** to create new text elements
4. Customize each text element using the provided controls
5. When satisfied, click **"Download Image"** to save your creation

## Project Structure

```
📂 text-behind-image
├── 📁 app         # Next.js application routes and layouts
├── 📁 components  # UI components organized by feature
├── 📁 editor      # Editor-specific components
├── 📁 ui         # Reusable UI components
├── 📁 hooks      # Custom React hooks
├── 📁 lib        # Utility functions
```

## License

This project is licensed under the **MIT License**.

## Credits

- Background removal powered by [IMG.LY Background Removal](https://github.com/imgly/background-removal)
- UI components based on [shadcn/ui](https://ui.shadcn.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
