# Changelog

All notable changes to NAJA will be documented in this file.

## [1.0.0] - 2025-01-11

### 🎉 Initial Release

#### ✨ Features

**Authentication & User Management**
- Email/password authentication with Supabase Auth
- Automatic profile creation on signup
- Secure session management with auto-refresh tokens
- User roles system (admin, user)
- Custom useAuth hook for authentication state

**Prayer Times**
- Real-time prayer times using AlAdhan API
- Intelligent caching system to reduce API calls
- Automatic calculation of next prayer
- Support for multiple calculation methods (MWL, ISNA, Egypt, Makkah, Karachi, Tehran, Jafari)
- Geolocation-based prayer times
- Today's prayer times display with countdown

**Reflection Journal**
- Create and save daily reflections
- Guided prompts for reflection
- Support for voice notes (future)
- Photo attachments (future)
- Date-based organization
- Filter and search reflections
- Edit and delete entries

**Habit Tracking**
- Preset spiritual habits (Salah, Dhikr, Qur'an, Gratitude)
- Custom habit creation
- Daily completion tracking
- Streak calculation
- Visual progress indicators
- Habit categories and frequency settings
- Reminder times

**Dua Builder**
- 6-step guided dua creation
  1. Praise (Hamd)
  2. Salawat (Blessings on Prophet)
  3. Personal Need
  4. Seeking Forgiveness
  5. Conclusion
  6. Amin
- Save duas with titles and categories
- Dua library with search
- Favorite duas
- Reminder scheduling
- Export dua cards (future)

**Dhikr Counter**
- Interactive tap counter
- Configurable targets (33, 99, custom)
- Session saving with date tracking
- Total count display
- Reset functionality
- Haptic feedback (web vibration API)

**AI Companion (NAJA)**
- Streaming chat interface
- Personalized spiritual guidance
- Faith-aligned responses
- Context-aware suggestions
- Customizable companion profile
  - Name selection
  - Voice tone (warm, gentle, encouraging)
  - Appearance presets
  - Behavior settings
- Powered by Lovable AI (Gemini 2.5 Flash)
- Rate limit handling
- Never issues religious rulings

**Dashboard**
- Personalized greeting (Assalamu Alaikum)
- Prayer times overview
- Next prayer countdown
- Daily habits snapshot
- Dhikr counter quick access
- Beautiful card-based UI
- Smooth animations

**Profile & Settings**
- Display name management
- Prayer calculation method selection
- Timezone configuration
- Location (latitude/longitude) for prayer times
- Language preference (en, ar, fr)
- Hijri calendar toggle
- Notifications toggle
- Sign out functionality

#### 🗄️ Database

**Schema**
- 10 tables with complete RLS policies
- Enums for roles and prayer methods
- Foreign key relationships
- Automatic timestamps (created_at, updated_at)
- Performance indexes on common queries

**Security**
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Security definer function for role checking
- Admin-only operations properly secured
- No recursive RLS policies

**Triggers**
- Auto-update timestamps on record updates
- Automatic profile/role creation on user signup
- Companion profile initialization

#### ⚡ Edge Functions

**prayer-times**
- Public endpoint (no auth required)
- Fetches from AlAdhan API
- Caches results by location/method/date
- Returns prayer times with next prayer calculation
- Error handling and fallbacks

**ai-chat**
- Authenticated endpoint
- Streaming SSE responses
- Fetches user's companion profile for personalization
- System prompt with faith-aligned guidelines
- Rate limit (429) and credit (402) handling
- Proper CORS configuration

**weekly-summary**
- Authenticated endpoint
- Aggregates last 7 days of data
- Fetches reflections, habits, dhikr sessions
- Calculates completion rates and streaks
- AI-generated personalized summary
- Returns stats + narrative summary

#### 🎨 Design System

**Colors**
- Lime green primary (--primary)
- Lavender secondary (--secondary)
- Charcoal accent (--accent)
- Neutral grays for text and backgrounds
- HSL color format throughout
- Semantic color tokens

**Components**
- Organic card shapes with rounded corners (1.5-2rem)
- Soft shadows and elevation
- Smooth transitions (150-200ms)
- Micro-animations on interactions
- Floating bottom navigation
- Responsive design (mobile-first)

**Typography**
- System font stack (SF Pro / Inter)
- Headings: 20-24pt
- Body: 14-16pt  
- Tight line-height for readability
- Ample whitespace

#### 🧪 Testing

**Unit Tests (Vitest)**
- Prayer service tests
- Database service tests
- Auth hook tests
- Utility function tests
- Component logic tests

**E2E Tests (Playwright)**
- Authentication flow
- Dashboard navigation
- Journal creation
- Habit completion
- Dua builder flow
- AI companion chat
- Prayer times display

#### 🚀 CI/CD

**GitHub Actions**
- Automated testing on PR
- Lint checks
- Type checking
- Build verification
- Test coverage reporting

#### 📦 Dependencies

**Core**
- React 18.3.1
- TypeScript 5.x
- Vite 5.x
- React Router DOM 6.30.1
- @supabase/supabase-js 2.81.0
- @tanstack/react-query 5.83.0

**UI**
- Tailwind CSS 3.x
- shadcn/ui components
- Radix UI primitives
- Lucide React icons
- class-variance-authority

**Development**
- Vitest
- Playwright
- ESLint
- TypeScript ESLint

#### 📚 Documentation

- Comprehensive README with setup instructions
- Database schema documentation
- Edge function API documentation
- Testing guide
- Deployment guide
- Security best practices
- Internationalization guide
- Troubleshooting section

#### 🌍 Internationalization

- i18n infrastructure ready
- English (default)
- Arabic support (RTL)
- French support
- Hijri calendar toggle
- Locale-aware date formatting

### 🔒 Security

- Auto-confirm email enabled for development
- Secure password requirements (min 6 chars)
- JWT tokens with auto-refresh
- httpOnly cookie support
- CORS properly configured
- No SQL injection vulnerabilities
- Input validation on all forms
- XSS protection
- CSRF protection

### 📱 Mobile Support

- Fully responsive design
- Mobile-first approach
- Touch-friendly UI elements
- Bottom navigation for easy thumb access
- Optimized for iOS and Android browsers
- Progressive Web App ready (future)

### ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast compliance
- Screen reader friendly
- Error messages properly announced

### 🐛 Known Issues

- None at launch

### 🔮 Future Enhancements

**Planned for v1.1**
- Google Calendar sync
- iCal export
- Outlook integration
- Push notifications
- Dark/light mode toggle
- More AI companion personalities
- Voice input for reflections
- Photo uploads to Storage
- Community features
- Shared habits with friends

**Planned for v1.2**
- Qur'an reader
- Tafsir integration
- Hadith of the day
- Islamic calendar events
- Ramadan features
- Fasting tracker
- Zakat calculator
- Qibla finder

### 📝 Migration Notes

**From Mock Data to Supabase**
- All in-memory mock data replaced with Supabase
- Data persists between sessions
- User-specific data isolation
- Automatic backups via Supabase

**Breaking Changes**
- None (initial release)

### 🙏 Credits

- AlAdhan API for prayer times
- Lovable for AI infrastructure
- Supabase for backend platform
- shadcn for UI components
- The Muslim dev community for inspiration

---

## How to Update

### For Users
Click "Publish" in Lovable to get the latest frontend updates.
Backend updates deploy automatically.

### For Developers
```bash
git pull origin main
npm install
npm run build
```

### Database Migrations
Migrations run automatically via Lovable Cloud.
Check migration status in Cloud dashboard.

---

**Note**: This is a living document. All changes will be documented here.