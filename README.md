# Vittam Manager

A modern, AI-powered expense tracking application built with Next.js, featuring intelligent categorization, financial insights, and beautiful data visualizations. Designed specifically for Indian users with support for Indian Rupees (₹) and local context.

## Features

- 🤖 **AI-Powered Insights**: Get personalized financial recommendations and spending analysis
- ✨ **Smart Categorization**: Automatic expense categorization using AI
- 📊 **Beautiful Dashboard**: Intuitive charts and statistics to visualize your spending
- 🔐 **Secure Authentication**: Powered by Clerk for seamless user management
- 🌙 **Dark Mode**: Built-in theme switching for comfortable viewing
- 💰 **Indian Rupee Support**: Native currency formatting and local context
- 📱 **Mobile Responsive**: Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI**: OpenAI/OpenRouter integration
- **Charts**: Chart.js with react-chartjs-2
- **Deployment**: Vercel

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see Vittam Manager in action.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

Create a `.env.local` file in the root directory and add:

```bash
# Database
DATABASE_URL="your-postgresql-url"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"

# AI Integration
OPENROUTER_API_KEY="your-openrouter-api-key"
# OR
OPENAI_API_KEY="your-openai-api-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Database Setup

1. Set up your PostgreSQL database
2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Features Overview

### AI-Powered Financial Insights
- Automatic expense categorization
- Spending pattern analysis
- Personalized financial recommendations
- Interactive AI chat for financial queries

### Smart Dashboard
- Real-time expense tracking
- Visual charts and graphs
- Monthly spending overview
- Best/worst expense tracking

### User Experience
- Clean, modern interface
- Dark/light theme support
- Mobile-first responsive design
- Fast, optimized performance

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
