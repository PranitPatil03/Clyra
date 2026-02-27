# Clyra - AI Contract Analysis

An intelligent contract analysis platform built to help users quickly review, comprehend, and analyze lengthy legal documents using advanced Generative AI. 

## 🚀 Tech Stack

### Frontend (Client)
- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Framer Motion (for animations)
- **State Management:** Zustand, React Query
- **Payments:** Stripe
- **Additional Tools:** Axios, Lucide React, Recharts, React Dropzone

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Better Auth
- **AI Integration:** Groq SDK, Google Generative AI
- **Cache/Session:** Upstash Redis
- **Emails:** Resend
- **File Parsing:** PDF.js, Multer
- **Payments:** Stripe

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Redis instance (Upstash recommended)

### Installation

1. Clone the repository and navigate to the project root.
2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../server
   npm install
   ```

### Environment Variables
You'll need to set up `.env` files in both the `client` and `server` directories. Make sure to configure your:
- MongoDB URI
- Redis credentials
- API Keys for Stripe, Groq, Google Generative AI, and Resend
- Authentication secrets

### Running Locally

1. Start the server (from the `/server` directory):
   ```bash
   npm run dev
   ```

2. Start the client (from the `/client` directory):
   ```bash
   npm run dev
   ```

3. Open up your browser and navigate to `http://localhost:3000`.

## 📜 License
This project is licensed under the MIT License.
