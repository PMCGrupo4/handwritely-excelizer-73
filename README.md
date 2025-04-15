# HandSheet - Excel Command Generator

A web application that converts handwritten commands into Excel files using OCR technology.

## Features

- User authentication with email/password and Google
- Handwriting recognition using Google Cloud Vision API
- Excel file generation
- Multi-language support (English and Spanish)
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud Vision API credentials
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=your_api_url
   ```

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Authentication

The application supports:
- Email/password authentication
- Google authentication

## OCR Integration

The application uses Google Cloud Vision API for handwriting recognition. Make sure to:
1. Set up a Google Cloud project
2. Enable the Vision API
3. Create a service account
4. Download the credentials JSON file
5. Configure the backend with the credentials

## Deployment

The application is configured for deployment on Netlify. Make sure to:
1. Set up the environment variables in Netlify
2. Configure the build settings
3. Set up the redirect rules

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR capabilities
- [XLSX.js](https://github.com/SheetJS/sheetjs) for Excel generation
- [Supabase](https://supabase.com) for backend services
- [Shadcn UI](https://ui.shadcn.com) for UI components
