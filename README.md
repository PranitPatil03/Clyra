# Clyra - AI Contract Analysis

An intelligent contract analysis platform built to help users quickly review, comprehend, and analyze lengthy legal documents using advanced Generative AI. 

## ✨ Features

- **PDF contract upload and parsing** with automatic text extraction.
- **AI contract type detection** before analysis (e.g., lease, NDA, employment).
- **Tier-based AI analysis**:
   - Free: risk and opportunity highlights, summary, favorability score.
   - Pro: deeper risk/opportunity coverage, key clauses, legal compliance, negotiation points, and recommendations.
- **Overall contract favorability score** to quickly assess contract quality.
- **Secure authentication** with email/password and Google OAuth.
- **User dashboard** to view and manage previously analyzed contracts.
- **Contract detail pages** with structured analysis output and severity/impact indicators.
- **Report export** from the analysis view for sharing/record keeping.
- **Stripe subscription flow** for upgrading to Pro.
- **Redis-backed caching/session support** for faster contract retrieval and temporary file handling.

## 👥 Who Uses Clyra and Why

- **Individuals and freelancers**:
   - Use Clyra to understand personal contracts quickly without reading dense legal text line by line.
- **Professionals and founders**:
   - Use Clyra to review NDAs, vendor agreements, and service contracts faster before signing.
- **Operations, HR, and procurement teams**:
   - Use Clyra to identify risky clauses, compare opportunities, and speed up internal contract review.
- **Legal teams and consultants**:
   - Use Clyra as a first-pass analysis assistant to surface negotiation points and prioritize deeper manual review.

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
