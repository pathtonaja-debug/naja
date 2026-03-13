

# App Improvement Roadmap

Based on your feedback, here is a phased plan addressing all five areas -- navigation confusion (your biggest pain point) first, then data persistence, gamification, content, and social.

---

## Phase 1: Fix Navigation Confusion

**Problem:** The + menu has 9 items in a flat list. Users cannot quickly find what they need. The relationship between Dashboard, Practices, and the + menu items is unclear.

**Solution: Reorganize into clear categories**

- Group the + menu into 2-3 sections with headers: "Worship" (Quran, Dhikr, Dua), "Growth" (Learn, Goals, Journal), "Tools" (Dates, Fintech, Pilgrimage)
- Add a search/filter to the + popover for quick access
- Add subtle section dividers and category labels in the popover
- Show recently-used items at the top (stored in localStorage)
- Reduce visual clutter: smaller icons, tighter spacing

**Files:** `src/components/ui/plus-popover.tsx`, `src/lib/navigation.ts`

---

## Phase 2: Sync Local Data to Cloud

**Problem:** Critical user data lives only in localStorage (`naja_*` keys) and is lost on device switch or browser clear. This includes: daily progress, reflections, duas, quiz attempts, gamification stats, goals, Ramadan resolutions, Quran reading state, dhikr history.

**Solution: Dual-write pattern**

- Create a `src/services/syncService.ts` that writes to both localStorage (instant) and the cloud DB (async)
- On login, merge local data with cloud data (cloud wins on conflict, local fills gaps)
- New DB tables needed: `daily_progress`, `quran_reading_state`, `user_goals`
- Migrate `useGuestProfile` to read from cloud when authenticated, fall back to local
- Add a "Syncing..." indicator in Profile settings

**New tables:**
- `daily_progress` (user_id, date, acts jsonb, points, completed_count, total_count)
- `quran_reading_state` (user_id, last_surah, last_verse, bookmarks jsonb, read_surahs int[])
- `user_goals` (user_id, goal_config jsonb, daily_completions jsonb, streak, status)

**Files:** New `src/services/syncService.ts`, updates to `useGuestProfile.ts`, `dailyProgressService.ts`, `quranReadingState.ts`, `goalsStore.ts`, `ramadanResolutionsStore.ts`

---

## Phase 3: Gamification Overhaul

**Problem:** Gamification is split between `useGuestProfile` (localStorage), `localStore.ts` (localStorage), and `user_gamification` (DB). Points feel arbitrary. No visible progression loop.

**Solution: Unified progression system**

- Single source of truth: cloud `user_gamification` table (with local cache)
- Add milestone rewards at key thresholds (100, 500, 1000 points)
- Add weekly challenges (e.g., "Read Quran 5 days this week") stored in a new `weekly_challenges` table
- Show streak calendar on Dashboard (dot per active day, like GitHub contribution graph)
- Badge system: auto-award badges based on DB triggers (first prayer logged, 7-day streak, 30 days, etc.)

**New table:** `weekly_challenges` (id, user_id, challenge_type, target, progress, week_start, completed)

---

## Phase 4: Content Depth

- **Quran:** Add Juz-based navigation alongside Surah list; add audio recitation links (external)
- **Learn:** Add 3 more modules: Seerah (Prophet's life), Islamic Finance basics, Family in Islam
- **Pilgrimage:** Add interactive packing checklist with localStorage persistence
- **Dua:** Add "Dua of the Day" rotation on Dashboard from Quranic duas data
- **Practices:** Add Tahajjud/Qiyam tracking as optional night prayer

---

## Phase 5: Social Features

- **Accountability partners:** Pair with a friend via invite code, see each other's streak (not details)
- **Community duas:** Anonymous shared dua wall (new `community_duas` table, moderated)
- **Leaderboard:** Currently a page but likely empty -- populate from `user_gamification` table with opt-in visibility
- **Shared goals:** Create a group goal (e.g., "Read Quran together") with aggregate progress

**New tables:** `friendships`, `community_duas`, `group_goals`

---

## Recommended Execution Order

Each phase is independent but builds on the previous. I recommend tackling them in order:

1. **Phase 1** (Navigation) -- immediate UX win, ~1 session
2. **Phase 2** (Data sync) -- critical for retention, ~2-3 sessions
3. **Phase 3** (Gamification) -- engagement driver, ~1-2 sessions
4. **Phase 4** (Content) -- depth, ~1-2 sessions per module
5. **Phase 5** (Social) -- growth, ~2-3 sessions

Which phase would you like to start with?

