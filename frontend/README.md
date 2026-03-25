# Fraud Detection Frontend

Modern Next.js 15 frontend for the Credit Card Fraud Detection system.

## Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 📘 TypeScript for type safety
- 🔄 Real-time API integration
- 📊 Interactive prediction interface
- 🎯 Responsive design
- ⚙️ Health monitoring

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 8000

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── PredictionForm.tsx
│   │   ├── ResultCard.tsx
│   │   └── StatsCard.tsx
│   ├── lib/              # Utilities
│   │   ├── api.ts        # API client
│   │   └── utils.ts      # Helper functions
│   └── types/            # TypeScript types
│       └── index.ts
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Integration

The frontend connects to the backend API:

- `GET /health` - Health check
- `POST /predict` - Fraud prediction

## Features

### Transaction Analysis
- Input transaction details
- Generate random test data
- Real-time fraud prediction
- Confidence scores

### Results Display
- Visual fraud indicators
- Probability metrics
- Confidence levels
- Actionable recommendations

### System Monitoring
- API health status
- Real-time connection monitoring
- Error handling

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t fraud-detection-frontend .
docker run -p 3000:3000 fraud-detection-frontend
```

### Static Export
```bash
npm run build
# Deploy the 'out' directory
```

## Customization

### Styling
Edit `tailwind.config.ts` to customize colors and theme.

### API URL
Update `NEXT_PUBLIC_API_URL` in `.env.local`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
