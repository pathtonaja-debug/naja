

# NAJA Enhancement Plan — 9 Changes

## Overview

This plan covers 9 distinct changes: removing Google auth, confirming auth wall stays, fixing auth access issues, fixing weekly summary, adding Morning/Evening Adhkar with notifications, adding haptic feedback, fixing prayer auto-scroll, removing the `generate-story` edge function, and removing the Index.tsx delay.

---

## 1. Remove Google Authentication

**Files to change:**
- `src/pages/Auth.tsx`

**What changes:**
- Remove the `GoogleLogo` SVG component (lines 21-28)
- Remove `googleLoading` state variable
- Remove `handleGoogleSignIn` function (lines 85-110)
- Remove the "or" divider and Google sign-in button (lines 331-358)
- Remove `disabled={googleLoading}` from all input/button elements
- In `useEffect` auth state change handler, remove the Google-specific `/welcome` redirect logic — just redirect to `/dashboard` or `/onboarding` based on profile existence

**Files to potentially remove:**
- `src/pages/WelcomeNewUser.tsx` — only used for Google OAuth new users. Remove route from `App.tsx` as well.

---

## 2. Keep Mandatory Auth Wall

No code changes needed — the current `ProtectedRoute` in `App.tsx` already enforces authentication. The project rules mentioning "Guest mode forever" should be disregarded per your request. The auth wall stays as-is.

---

## 3. Fix Auth Layer Blocking Access

**Problem:** The `ProtectedRoute` component in `App.tsx` uses `AuthContext` which relies on `getSession()`. This should work, but there may be race conditions where `onAuthStateChange` fires before `getSession` resolves, or the session is stale.

**Files to change:**
- `src/App.tsx` — Ensure `ProtectedRoute` properly waits for session resolution. The current implementation looks correct but we'll add a safety check: if `session` exists, render children immediately without the navigate effect firing prematurely.

**Additional fix:** The `useDashboardStats.ts` hook uses `getAuthenticatedUserId()` which calls `supabase.auth.getUser()` separately. If this fails, the entire dashboard shows no data. We'll add error handling so stats degrade gracefully rather than blocking.

- `src/hooks/useDashboardStats.ts` — Wrap the `getAuthenticatedUserId()` call in a try/catch so dashboard doesn't break if auth is momentarily unavailable.

---

## 4. Fix Weekly Progress Summary

**Problem:** The `weekly-summary` edge function uses `openaiChatText` from `_shared/openai.ts`, which uses `LOVABLE_API_KEY`. The function has no logs, suggesting it's never called.

**Files to change:**
- `src/pages/Dashboard.tsx` or `src/pages/Profile.tsx` — Add a widget that calls the `weekly-summary` edge function and displays results. We'll add it to the Dashboard as a collapsible "Weekly Recap" card.
- `supabase/functions/weekly-summary/index.ts` — Update CORS headers to include the full list of required Supabase client headers (currently missing `x-supabase-client-platform` etc.).

**New file:**
- `src/components/dashboard/WeeklySummaryCard.tsx` — A card that fetches the weekly summary on mount (cached in `localStorage` for 24h with key `naja_weekly_summary`), displays stats and AI-generated text.

---

## 5. Add Morning/Evening Adhkar in Dua Tab + Notifications

**New files:**
- `src/data/adhkarData.ts` — Static data file containing Morning Adhkar (Adhkar al-Sabah) and Evening Adhkar (Adhkar al-Masa) with Arabic text, transliteration, translation (EN/FR), repetition count, and source references. Approximately 15-20 authentic adhkar per section from Hisn al-Muslim.
- `src/components/dua/AdhkarReader.tsx` — Sequential reader component with: current dhikr display (Arabic + transliteration + translation), repetition counter per dhikr, progress indicator, completion tracking stored in `localStorage` (`naja_adhkar_morning_YYYY-MM-DD`, `naja_adhkar_evening_YYYY-MM-DD`).

**Files to change:**
- `src/pages/Dua.tsx` — Add "Morning Adhkar" and "Evening Adhkar" entry points in the library view (two prominent cards at the top before the builder choice).
- `src/lib/i18n.ts` — Add translation keys for adhkar UI labels.
- `supabase/functions/send-push-notifications/index.ts` — Add two new notification schedules:
  - Morning Adhkar reminder: triggered around Fajr time (using cached prayer times)
  - Evening Adhkar reminder: triggered around Maghrib time
- `src/lib/notificationContent.ts` — Add `adhkarMorning` and `adhkarEvening` notification content in EN/FR.

---

## 6. Create Haptic Feedback on Prayer/Dhikr Completion

**New file:**
- `src/lib/haptics.ts` — Utility that wraps `navigator.vibrate()` for web and Capacitor Haptics for native. Exports: `hapticLight()`, `hapticMedium()`, `hapticSuccess()`. Falls back gracefully if not supported.

**Files to change:**
- `src/pages/Practices.tsx` — Call `hapticSuccess()` in `togglePrayerDone()` when marking a prayer complete, and `hapticLight()` in `toggleSunnah()`.
- `src/pages/Dhikr.tsx` — Call `hapticLight()` on each counter increment, `hapticSuccess()` on target completion.
- `src/components/dashboard/DhikrCounter.tsx` — Call `hapticLight()` on increment, `hapticSuccess()` on target reached.

---

## 7. Fix Prayer Auto-Scroll on Dashboard

**Problem:** Dashboard navigates to `/practices?prayer=fajr` etc., but Practices page doesn't read or act on the `prayer` query parameter.

**Files to change:**
- `src/pages/Practices.tsx` — Read `searchParams.get('prayer')` on mount. If present, set `expandedGroup` to that prayer ID and scroll the corresponding card into view using `useRef` + `scrollIntoView()`. Add `ref` attributes to each prayer group `Card`.

---

## 8. Remove `generate-story` Edge Function

**Files to delete:**
- `supabase/functions/generate-story/index.ts`

**Files to change:**
- `supabase/config.toml` — Remove the `[functions.generate-story]` section.

The edge function will also be deleted from the deployed functions.

---

## 9. Remove 800ms Artificial Delay on Index.tsx

**Files to change:**
- `src/pages/Index.tsx` — Remove the `setTimeout(() => { checkAuthAndRedirect(); }, 800)` wrapper. Call `checkAuthAndRedirect()` directly in the `useEffect`.

---

## Technical Summary

| # | Change | Files Modified | Files Created | Files Deleted |
|---|--------|---------------|---------------|---------------|
| 1 | Remove Google Auth | Auth.tsx, App.tsx | -- | WelcomeNewUser.tsx |
| 2 | Keep Auth Wall | None | -- | -- |
| 3 | Fix Auth Access | App.tsx, useDashboardStats.ts | -- | -- |
| 4 | Fix Weekly Summary | weekly-summary/index.ts, Dashboard.tsx | WeeklySummaryCard.tsx | -- |
| 5 | Morning/Evening Adhkar | Dua.tsx, i18n.ts, send-push-notifications, notificationContent.ts | adhkarData.ts, AdhkarReader.tsx | -- |
| 6 | Haptic Feedback | Practices.tsx, Dhikr.tsx, DhikrCounter.tsx | haptics.ts | -- |
| 7 | Prayer Auto-Scroll | Practices.tsx | -- | -- |
| 8 | Remove generate-story | config.toml | -- | generate-story/index.ts |
| 9 | Remove Index delay | Index.tsx | -- | -- |

**Storage keys touched:** `naja_adhkar_morning_*`, `naja_adhkar_evening_*`, `naja_weekly_summary`

**Routes affected:** `/auth`, `/welcome` (removed), `/dua` (adhkar added), `/practices` (auto-scroll), `/dashboard` (weekly card)

**Manual test checklist:**
1. Sign up with email/password, verify email, sign in -- confirm full access to all pages
2. Open Dashboard, tap a prayer time row, confirm Practices opens with that prayer expanded and scrolled into view
3. Open Dua tab, tap "Morning Adhkar", go through the sequential reader, confirm completion saves
4. Mark a prayer as done in Practices -- confirm haptic/vibration fires
5. Increment dhikr counter -- confirm haptic fires on each tap and on completion
6. Check Dashboard for "Weekly Recap" card (requires at least some activity data)
7. Confirm `/welcome` route no longer exists (should 404)
8. Confirm Index page loads instantly (no 800ms delay)
9. Switch to French and verify Adhkar content displays correctly

