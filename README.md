
# CNN Medical Image Compressor

**Programmer:** Igboeche Johnfavour Ikenna  
**Email:** igboechejohn@gmail.com  
**Phone:** 08169849839

---

## 1. Project Overview

The CNN Medical Image Compressor is an advanced web-based platform designed to compress high-resolution medical images using a simulated Convolutional Neural Network (CNN) engine. The primary goal is to significantly reduce file sizes for efficient storage and transmission while preserving critical diagnostic quality.

This application leverages modern frontend technologies, including **React** and **Tailwind CSS**, to create a responsive and intuitive user interface. A key feature is its integration with the **Google Gemini API**, which provides AI-powered suggestions for optimal compression quality, acting as an expert assistant to the user.

## 2. Key Features

- **AI-Powered Quality Suggestion**: Utilizes the Gemini Vision model to analyze medical images (e.g., X-rays, MRIs, CT scans) and recommend the ideal compression quality setting to balance detail preservation and file size.
- **Interactive Compression Controls**: A user-friendly slider allows for manual adjustment of the compression quality from 1 to 100.
- **Side-by-Side Image Comparison**: Displays the original and compressed images next to each other for immediate visual assessment of the compression results.
- **Persistent Compression History**: Automatically saves each compression session to the browser's `localStorage`. This history is displayed in a clear, tabular format.
- **Data Export**: The entire compression history can be downloaded as a `.csv` file for external analysis and record-keeping.
- **Drag-and-Drop Uploader**: A modern, easy-to-use interface for uploading image files.
- **Responsive Design**: The user interface is fully responsive and optimized for both desktop and mobile devices.

## 3. Tech Stack

- **Frontend Framework**: React
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Language**: TypeScript

## 4. Getting Started

### Prerequisites

- An up-to-date web browser.
- A Google Gemini API key.

### Environment Variables

To enable the AI-powered features, you must have a Google Gemini API key. This project is configured to read the key from an environment variable named `process.env.API_KEY`. In a local development environment, you would typically create a `.env` file in the project root:

```
# .env
API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

**Note**: In the context of the web platform where this app runs, this variable is expected to be pre-configured.

## 5. Project Structure

The codebase is organized into logical directories to ensure scalability and maintainability.

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── icons/
│   │   │   └── Icons.tsx         # SVG icon components
│   │   ├── CompressionControls.tsx # Slider and buttons for compression
│   │   ├── Header.tsx            # Application header
│   │   ├── HistoryDisplay.tsx    # Table for showing past results
│   │   ├── ImageViewer.tsx       # Side-by-side image display
│   │   ├── ImageUploader.tsx     # Drag-and-drop file input
│   │   └── Spinner.tsx           # Loading spinner component
│   │
│   ├── services/
│   │   ├── analysisService.ts    # Handles communication with the Gemini API
│   │   └── compressionService.ts # Simulates the image compression logic
│   │
│   ├── App.tsx                   # Main application component, manages state
│   ├── index.tsx                 # Entry point for the React application
│   └── types.ts                  # TypeScript type definitions
│
├── index.html                    # Main HTML file
└── metadata.json                 # Application metadata
```

### Core Components

- **`App.tsx`**: The main stateful component that orchestrates the entire application flow, managing state for the image, compression results, history, and loading statuses.
- **`ImageUploader.tsx`**: Provides the UI for users to select an image file from their local machine via clicking or dragging and dropping.
- **`CompressionControls.tsx`**: Contains the quality slider, the "Compress" button, and the "Get AI Suggestion" button. It handles user input for compression settings.
- **`ImageViewer.tsx`**: Renders the original and compressed images side-by-side, allowing for easy visual comparison. Includes a download button for the compressed image.
- **`HistoryDisplay.tsx`**: Displays a log of all previous compressions in a table, with options to view a specific result again or download the entire history as a CSV.

### Services

- **`compressionService.ts`**: Contains the `simulateCompression` function. This module mocks a sophisticated backend process, generating realistic compression metrics (ratio, SSIM, PSNR) based on the selected quality.
- **`analysisService.ts`**: Manages all interactions with the Google Gemini API. The `getAiQualitySuggestion` function sends the user's image to the AI model and processes the response to extract a suggested quality level.

