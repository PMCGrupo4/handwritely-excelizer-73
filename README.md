# HandSheet - Handwriting to Excel Converter

HandSheet is a web application that converts handwritten receipts and commands into Excel spreadsheets using OCR technology.

## Features

- Upload images of handwritten receipts/commands
- Use your device's camera to capture receipts
- Automatic OCR processing to extract text
- Convert extracted data to Excel format
- User authentication with email/password, Google, and Facebook
- Save and manage your processed commands

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (Authentication, Database, Storage)
- **OCR**: Tesseract.js
- **Excel Generation**: XLSX.js

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/handwritely-excelizer.git
   cd handwritely-excelizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Set up your Supabase project:
   - Create a new project at [Supabase](https://supabase.com)
   - Get your project URL and anon key from the project settings
   - Add them to your `.env` file

5. Set up Supabase Authentication:
   - In your Supabase dashboard, go to Authentication > Providers
   - Enable Email/Password authentication
   - Enable Google authentication (requires Google OAuth credentials)
   - Enable Facebook authentication (requires Facebook App credentials)

6. Create the necessary database tables:
   ```sql
   -- Create a table for storing commands
   CREATE TABLE commands (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     image_url TEXT,
     items JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create an index for faster queries
   CREATE INDEX commands_user_id_idx ON commands(user_id);

   -- Set up Row Level Security (RLS)
   ALTER TABLE commands ENABLE ROW LEVEL SECURITY;

   -- Create a policy that allows users to see only their own commands
   CREATE POLICY "Users can view their own commands" 
   ON commands FOR SELECT 
   USING (auth.uid() = user_id);

   -- Create a policy that allows users to insert their own commands
   CREATE POLICY "Users can insert their own commands" 
   ON commands FOR INSERT 
   WITH CHECK (auth.uid() = user_id);

   -- Create a policy that allows users to update their own commands
   CREATE POLICY "Users can update their own commands" 
   ON commands FOR UPDATE 
   USING (auth.uid() = user_id);

   -- Create a policy that allows users to delete their own commands
   CREATE POLICY "Users can delete their own commands" 
   ON commands FOR DELETE 
   USING (auth.uid() = user_id);
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open your browser and navigate to `http://localhost:5173`

## Deployment

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR capabilities
- [XLSX.js](https://github.com/SheetJS/sheetjs) for Excel generation
- [Supabase](https://supabase.com) for backend services
- [Shadcn UI](https://ui.shadcn.com) for UI components
