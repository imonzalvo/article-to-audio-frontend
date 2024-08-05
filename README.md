# Article-to-Audio Frontend

## Overview

This is the frontend for the Article-to-Audio application. It provides a user interface for converting Substack articles to audio summaries, built with React and enhanced with shadcn UI components.

## Features

- User authentication (including Google Sign-In)
- Article submission and conversion tracking
- Audio player for listening to converted articles
- Progress indicator for long-running conversions
- Responsive design with shadcn UI components
- Engaging landing page with feature cards and sample audio

## Prerequisites

- Node.js (v14 or later recommended)
- npm
- Backend API running and accessible

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   API_BASE_URL=your_backend_api_url
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

## Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. The application will be available at `http://localhost:3000` (or the port you've configured)

## Building for Production

To create a production build:

```
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Key Components

- **AudioPlayer**: Custom component for playing converted audio files
- **Home**: Landing page with feature cards and sample audio


## Deployment

Push to `main`

## Acknowledgements

This project was developed with significant assistance from AI, demonstrating the potential of AI-assisted development in creating functional and visually appealing user interfaces with minimal manual coding. Special thanks to the shadcn UI library for enhancing the application's aesthetics and usability.
