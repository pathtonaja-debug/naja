
# Active Ramadan Tab -- Phase 1 Implementation

## Summary
Transform the Ramadan tab from "Preparation" mode to a fully active Ramadan dashboard with daily tracking, countdown timers, ibadah grid, and rotating daily reminders. The accent color shifts to deep olive (#3b3923) with champagne gold decorations.

---

## New Files to Create

### 1. `src/styles/ramadan-theme.css`
Ramadan-specific CSS variables and animations:
- Deep olive ink accent (`#3b3923`) and champagne gold (`#c9a84c`)
- Keyframes: `twinkle` (stars), `lantern-glow`, `crescent-float`
- `.ramadan-active` class with CSS custom properties
- Staggered star animation delays

### 2. `src/components/ramadan/RamadanHeader.tsx`
The main header for the active Ramadan dashboard:
- "Day X of Ramadan" with automatic count from `phaseInfo.currentDayOfRamadan`
- Hijri + Gregorian date display
- Countdown to Iftar (Maghrib prayer time) and Suhoor (Fajr prayer time) using the existing `usePrayerTimes` hook
- Fasting status toggle: "Fasting Today" or "Excused (Travel/Sick)" -- stored via `ramadanDailyTracker` service
- Decorative crescent moon and star elements with champagne gold color
- Progress ring showing daily ibadah completion percentage

### 3. `src/components/ramadan/DailyIbadahTracker.tsx`
Quick-tap grid for daily worship tracking:
- 7 trackable items in a clean grid layout:
  - **Fasting**: Toggle (on/off)
  - **5 Daily Prayers**: 5 individual dot indicators
  - **Taraweeh**: Yes/No toggle
  - **Quran**: Pages count (taps increment by plan's pagesPerPrayer)
  - **Dhikr**: Counter link (navigates to Dhikr page)
  - **Charity**: Amount input (simple tap to log)
  - **Tahajjud**: Yes/No toggle
- Overall completion percentage with progress ring animation
- Streak counter (consecutive days with 50%+ completion)
- Gentle nudge messaging (no harsh red -- uses muted tones)
- All state managed via `ramadanDailyTracker` service

### 4. `src/components/ramadan/DailyReminderCard.tsx`
Rotating daily spiritual content:
- Content rotates based on day of Ramadan (1-30)
- 4-day cycle: Hadith -> Quranic Dua -> Tafsir snippet -> Reflection prompt
- Card displays Arabic text, transliteration, translation, and source
- Reflection prompts show a journaling-style question
- Swipeable or auto-rotating with subtle fade animation
- Content sourced from `ramadanDailyContent.ts`

### 5. `src/data/ramadanDailyContent.ts`
Curated content for 30 days of Ramadan:
- 30 motivational hadiths (Arabic + English translation keys)
- 10 Quranic duas (from the 40 Quranic duas, rotated)
- 10 short tafsir snippets (positive, love-focused)
- 30 reflection prompts (one unique prompt per day)
- All strings use i18n translation keys

### 6. `src/services/ramadanDailyTracker.ts`
Local storage service for daily ibadah tracking:
- Storage key: `naja_ramadan_ibadah_v1`
- Interface: `DailyIbadah` with fields for each trackable item
- Functions:
  - `getTodayIbadah(): DailyIbadah`
  - `updateIbadah(field, value): DailyIbadah`
  - `getCompletionPercent(ibadah): number`
  - `getIbadahStreak(): number`
  - `getFastingStatus(): 'fasting' | 'excused' | null`
  - `setFastingStatus(status): void`
- Storage key for fasting: `naja_ramadan_daily_v1`
- Data namespaced by date (YYYY-MM-DD)

---

## Files to Modify

### 7. `src/index.css`
- Add import for `./styles/ramadan-theme.css` at the top (after tokens.css import)

### 8. `src/pages/Ramadan.tsx`
- Add `.ramadan-active` class to the page wrapper when phase is `active`
- Restructure the `active` case in `renderOverview()` to use new components in order:
  1. `RamadanHeader` (countdown + fasting toggle)
  2. `DailyIbadahTracker` (quick-tap grid)
  3. `QuranPlanTracker` (existing, enhanced)
  4. `DailyReminderCard` (rotating content)
  5. Quick Duas access (existing)
  6. Laylatul Qadr card (existing, when applicable)
- Pass `phaseInfo` to `RamadanHeader`

### 9. `src/components/ramadan/QuranPlanTracker.tsx`
- Add "Pages remaining today" motivational message
- Add total progress toward khatam goal (e.g., "Page 120 of 604")
- Calculate total pages read across all days from `dailyProgress`
- Show "You need X pages to stay on track" suggestion based on remaining days

### 10. `src/lib/i18n.ts`
Add new translation keys (English + French) for:
- Ramadan header: `ramadan.fastingToday`, `ramadan.excused`, `ramadan.travelSick`
- Countdowns: `ramadan.countdown.iftar`, `ramadan.countdown.suhoor`, `ramadan.countdown.until`
- Ibadah tracker: `ramadan.ibadah.title`, `ramadan.ibadah.fasting`, `ramadan.ibadah.prayers`, `ramadan.ibadah.taraweeh`, `ramadan.ibadah.quran`, `ramadan.ibadah.dhikr`, `ramadan.ibadah.charity`, `ramadan.ibadah.tahajjud`, `ramadan.ibadah.streak`, `ramadan.ibadah.completed`
- Daily reminder: `ramadan.reminder.title`, `ramadan.reminder.hadith`, `ramadan.reminder.dua`, `ramadan.reminder.tafsir`, `ramadan.reminder.reflection`
- Quran enhanced: `ramadan.quran.pagesRemaining`, `ramadan.quran.stayOnTrack`, `ramadan.quran.totalProgress`
- 30 hadith translations, 10 dua translations, 10 tafsir translations, 30 reflection prompts -- all in EN + FR

---

## Technical Details

### Storage Keys (all `naja_*` namespaced)
| Key | Purpose |
|-----|---------|
| `naja_ramadan_ibadah_v1` | Daily ibadah tracking (per-day entries) |
| `naja_ramadan_daily_v1` | Fasting status per day |
| `naja_ramadan_quran_plan_v1` | Existing -- Quran plan selection |
| `naja_ramadan_progress_v1` | Existing -- overall progress |

### Dependencies
- No new packages needed
- Uses existing: framer-motion, lucide-react, usePrayerTimes hook, ramadanState service, ProgressRing component

### Component Hierarchy

```text
Ramadan.tsx (page)
  +-- .ramadan-active wrapper (when active phase)
  +-- RamadanHeader
  |     +-- Day counter + Hijri date
  |     +-- Iftar/Suhoor countdown (uses usePrayerTimes)
  |     +-- Fasting status toggle
  +-- DailyIbadahTracker
  |     +-- ProgressRing (completion %)
  |     +-- 7-item tap grid
  |     +-- Streak indicator
  +-- QuranPlanTracker (enhanced)
  |     +-- Total khatam progress
  |     +-- "Pages remaining" message
  +-- DailyReminderCard
  |     +-- Rotating hadith/dua/tafsir/reflection
  +-- Quick Duas (existing)
  +-- Laylatul Qadr (existing, conditional)
```

### Manual Test Checklist
- Navigate to Ramadan tab and verify "active" phase renders the new dashboard layout
- Verify Iftar and Suhoor countdowns update based on prayer times
- Toggle fasting status and refresh -- verify persistence
- Tap each ibadah item and verify state saves
- Check completion percentage updates in real-time
- Verify streak counter increments across days
- Confirm daily reminder card shows different content each day
- Check Quran plan shows "pages remaining" message
- Verify dark mode renders correctly with Ramadan theme
- Test with no internet (offline) -- all features should work from localStorage
