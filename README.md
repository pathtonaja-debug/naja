# NAJA - Islamic Lifestyle Companion

A minimalist, faith-aligned Islamic lifestyle app that helps Muslims integrate spiritual practices into daily life through reflection, dua, dhikr, habits, prayer awareness, and AI-powered guidance.

## 🌟 Features

### Core Functionality
- **Dashboard**: Real-time prayer times, dhikr counter, daily verse, habit tracking, and spiritual progress
- **Reflection Journal**: Daily guided prompts with voice-to-text support and privacy-first design
- **Dua Builder**: 6-step guided template to create personalized duas with prophetic structure
- **Habits Tracker**: Preset spiritual habits and custom habit creation with streak tracking
- **Prayer Times**: Accurate Salah times using AlAdhan API with multiple calculation methods
- **AI Companion**: Faith-aligned chatbot for spiritual guidance, reflection prompts, and encouragement
- **Progress Analytics**: Weekly summaries, streaks, and activity breakdowns

### Technical Features
- **Authentication**: Email/password auth with auto-confirmation
- **Real-time Data**: Supabase backend with Row-Level Security (RLS)
- **Edge Functions**: Prayer caching, AI chat, and weekly summary generation
- **Responsive Design**: Mobile-first with Apple HIG-inspired interface
- **Modern Stack**: React 18 + TypeScript + Vite + Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (via Lovable Cloud)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd naja

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Setup
Environment variables are auto-configured via Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Lucide icons
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions)
- **AI**: Lovable AI Gateway (Gemini, GPT models)
- **Testing**: Vitest, Playwright, Testing Library
- **CI/CD**: GitHub Actions

### Project Structure
```
naja/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route pages (Dashboard, Journal, etc.)
│   ├── services/        # API services (prayer, db)
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Supabase client & types
│   └── index.css        # Design system tokens
├── supabase/
│   ├── functions/       # Edge functions (prayer-times, ai-chat, weekly-summary)
│   ├── migrations/      # Database migrations
│   └── config.toml      # Supabase config
├── e2e/                 # Playwright tests
└── .github/workflows/   # CI/CD pipelines
```

### Database Schema
- **profiles**: User preferences (prayer method, timezone, notifications)
- **reflections**: Daily journal entries
- **habits**: Habit definitions and tracking
- **duas**: Custom duas with categorization
- **dhikr_sessions**: Dhikr counter logs
- **companion_profiles**: AI companion customization
- **prayer_times_cache**: Cached prayer times
- All tables have RLS policies for user data isolation

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests in UI mode
npm run test:ui
```

## 📦 Deployment

### Via Lovable (Recommended)
1. Click **Publish** in the top-right of the Lovable editor
2. Click **Update** to deploy frontend changes
3. Edge functions deploy automatically

### Manual Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Color Palette
- **Primary**: Lime green (`hsl(68 58% 62%)`) - vibrant, energetic
- **Secondary**: Lavender (`hsl(250 30% 75%)`) - calming, spiritual
- **Accent**: Charcoal (`hsl(220 12% 18%)`) - grounding, modern
- **Background**: Soft white (`hsl(240 8% 97%)`)

### Typography
- Font: System fonts (SF Pro / SF UI substitute)
- Headings: 20-24pt, tight line-height
- Body: 12-14pt with ample whitespace

### Design Principles
- Apple HIG-inspired minimalism
- Organic card shapes (border-radius: 1.5rem)
- Soft shadows and smooth transitions
- Motion-reduced mode support
- WCAG AA+ contrast compliance

## 🔒 Security & Privacy

- **Row-Level Security (RLS)** on all user tables
- **No public data**: All reflections, duas, habits are private
- **Encrypted data** at rest and in transit
- **Anonymous analytics** only
- **Clear data export** and account deletion options
- **No ads or trackers**

## 🌐 API Integrations

### AlAdhan Prayer Times API
```typescript
// services/prayer.ts
const response = await fetch(`${SUPABASE_URL}/functions/v1/prayer-times`, {
  method: 'POST',
  body: JSON.stringify({ latitude, longitude, method: 'ISNA' })
});
```

### Lovable AI (via Edge Function)
```typescript
// supabase/functions/ai-chat/index.ts
const response = await fetch('https://gateway.lovable.app/generate-text', {
  method: 'POST',
  headers: { 'x-lovable-ai-api-key': Deno.env.get('LOVABLE_AI_API_KEY')! },
  body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages })
});
```

## 📝 Contributing

1. Create a feature branch from `main`
2. Make changes following existing patterns
3. Run tests: `npm run test && npm run test:e2e`
4. Push and create a Pull Request

## 📄 License

Proprietary - All rights reserved

## 🔗 Links

- **Lovable Project**: https://lovable.dev/projects/a99e3493-9a5d-4e08-a315-7de1eecbac55
- **Documentation**: See `QA_CHECKLIST.md` and `CHANGELOG.md`
- **Support**: [Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)

## 🙏 Acknowledgments

Built with [Lovable](https://lovable.dev) - AI-powered fullstack development platform
