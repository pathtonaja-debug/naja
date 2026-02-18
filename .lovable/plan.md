

## Fix: Dashboard Loading Delay and Slow Page Transitions

### Root Causes Identified

1. **ProtectedRoute auth check blocks every navigation** -- Each route change calls `supabase.auth.getSession()` and shows a spinner until it resolves. This causes the blank white screen you see.

2. **PageTransition uses `mode="wait"`** -- This means the old page must fully exit-animate before the new page starts entering, doubling the perceived transition time.

3. **Dashboard has excessive staggered animations** -- 8+ sections each have `initial={{ opacity: 0, y: 20 }}` with increasing delays (up to 0.3s), so the page feels like it takes nearly a second to fully appear even after data is ready.

4. **Prayer API fetches entire month calendar** -- `fetchPrayerData` downloads the full month from Aladhan API on every dashboard mount, adding network latency before any prayer data renders.

---

### Changes

#### 1. Cache auth session in ProtectedRoute (`src/App.tsx`)
- Cache the auth session result at the app level so subsequent route navigations don't re-check auth from scratch
- Use a React context/ref to store the session once verified, and only re-check on `onAuthStateChange`
- This eliminates the blank white screen on every page navigation

#### 2. Switch PageTransition to `mode="popLayout"` and use faster timing (`src/components/PageTransition.tsx`)
- Change `AnimatePresence mode="wait"` to `mode="popLayout"` so enter and exit animations overlap (no more double-wait)
- Switch from spring to a fast tween: `duration: 0.2, ease: "easeOut"`
- Reduce slide distances (from `100%`/`-30%` to `60%`/`-15%`) for snappier feel

#### 3. Remove staggered animation delays from Dashboard (`src/pages/Dashboard.tsx`)
- Remove all `initial`, `animate`, and `transition={{ delay }}` props from inner sections
- Keep the single top-level `motion.div` fade-in (with no delay) so the page appears instantly
- Convert inner `motion.div` wrappers to plain `div` where they only exist for entrance animations

#### 4. Cache prayer API response (`src/services/prayerApiService.ts`)
- Cache the Aladhan response in `sessionStorage` keyed by date + coordinates
- On subsequent loads (same day, same location), use cached data instantly
- This makes the dashboard prayer card render immediately on return visits

---

### Technical Details

**Files to modify:**
- `src/App.tsx` -- Lift auth state into a shared context, remove per-route `getSession()` calls
- `src/components/PageTransition.tsx` -- Faster animation config
- `src/pages/Dashboard.tsx` -- Remove staggered motion delays
- `src/services/prayerApiService.ts` -- Add sessionStorage cache

**Storage keys touched:** `naja_prayer_cache` (new, sessionStorage)

**Manual test checklist:**
- Navigate to /dashboard -- should appear instantly without blank screen
- Navigate between tabs (Home, Practices, Ramadan, Profile) -- transitions should be fast and smooth
- Swipe back gesture should still work
- Prayer times should load instantly on second visit
- Refresh the page -- dashboard should load without delay

