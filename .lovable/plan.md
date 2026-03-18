

# Reduce Animations to Minimal Premium

## Problem

The app has 83 files using framer-motion, with heavy animation patterns causing lag and visual bugs:
- Page transitions slide 60% of viewport width on every route change
- LevelUpModal has 20 infinitely-repeating Sparkle animations
- CelebrationOverlay spawns 50 confetti particles
- BeadsAnimation and TasbihArc animate 11 beads each with springs, scales, rotations
- Bottom nav uses `layoutId` shared animation + AnimatePresence for label width
- Nearly every page wraps its root in `motion.div` with fade-in
- Swipe indicator loops infinitely with opacity + position animation
- `popLayout` mode causes overlapping enter/exit renders (two full pages in DOM at once)

## Strategy

Keep only two categories of animation:
1. **Functional feedback** -- brief scale on tap, progress bar fills, checkmarks
2. **Single premium touch** -- bottom nav active pill slide, modal/sheet entrance

Remove everything else: page slide transitions, staggered list entrances, infinite loops, confetti, repeated sparkles, and unnecessary motion wrappers.

---

## Changes

### 1. PageTransition.tsx -- Replace slide with simple opacity fade (0.15s)

Remove the `slideVariants` with `x: 60%` offsets. Replace with a minimal opacity-only transition. Switch `AnimatePresence` mode from `popLayout` to `wait` so only one page renders at a time (eliminates the dual-DOM overlap bug).

### 2. BottomNav.tsx -- Simplify nav animation

Keep the `layoutId` active bubble (it's lightweight and premium). Remove `AnimatePresence` + `motion.span` for label width animation -- just show/hide the label with CSS `overflow-hidden` and a fast CSS transition instead. Remove the `whileTap={{ scale: 0.92 }}` from the plus button (keep the CSS `active:scale-95` approach).

### 3. LevelUpModal.tsx -- Remove sparkle loop, simplify entrance

Remove the 20 infinitely-repeating Sparkle divs. Keep a single spring entrance for the modal card. Replace staggered content animations (4 sequential delays) with a single fade-in for all content.

### 4. CelebrationOverlay.tsx -- Replace confetti with simple message pulse

Remove the 50 confetti particles. Keep just the centered message with a simple scale-in. Reduce auto-dismiss from 3s to 2s.

### 5. BeadsAnimation.tsx -- Remove per-bead spring animations

Replace `motion.div` per bead with plain `div` using CSS transitions for color changes only. Remove the staggered `delay: index * 0.02` spring animation. Keep the drag gesture (functional). Remove the infinitely-looping swipe indicator animation -- show it as static text.

### 6. TasbihArc.tsx -- Simplify bead animation

Remove per-bead scale/rotate keyframe arrays. Keep simple position transition on active bead only. Remove infinite swipe indicator loop. Reduce animation duration from 280ms to 200ms.

### 7. All page-level motion wrappers -- Remove fade-in wrappers

Pages like Goals, Fintech, Achievements, Dashboard, HabitCategory, etc. wrap their root in `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>`. These are redundant with the PageTransition and cause double-animation. Replace with plain `<div>`.

Affected pages: Goals.tsx, Fintech.tsx, Achievements.tsx, HabitCategory.tsx, and any others found.

### 8. In-page tab content animations -- Simplify

Components like TodaysActsModule, QuickQuizWidget that use staggered `initial={{ opacity: 0, x: -20 }}` per list item -- remove the stagger, use a single CSS `animate-fade-in` on the container if needed.

### 9. PlusPopover.tsx -- Simplify

Remove the staggered `listItemVariants` with per-item delay. Remove the `layoutId="plus-popover-highlight"` liquid hover blob. Keep simple panel entrance (opacity + slight scale).

### 10. vite.config.ts -- Deduplicate React

Add `resolve.dedupe: ["react", "react-dom", "react/jsx-runtime"]` to prevent duplicate React instances which cause hook failures and animation glitches.

### 11. index.css -- Add prefers-reduced-motion to framer-motion

The CSS already has a `prefers-reduced-motion` block for CSS animations, but framer-motion ignores it. Since we're removing most framer-motion usage anyway, this is handled implicitly.

---

## Files Changed

| File | Action |
|------|--------|
| src/components/PageTransition.tsx | Simplify to opacity-only, mode="wait" |
| src/components/BottomNav.tsx | Remove label AnimatePresence, simplify plus button |
| src/components/gamification/LevelUpModal.tsx | Remove sparkle loop, simplify |
| src/components/ui/celebration-overlay.tsx | Remove confetti, keep message |
| src/components/dhikr/BeadsAnimation.tsx | Remove per-bead springs, static indicator |
| src/components/dhikr/TasbihArc.tsx | Simplify bead animation |
| src/components/ui/plus-popover.tsx | Remove stagger + hover blob |
| src/components/game/TodaysActsModule.tsx | Remove stagger |
| src/components/game/QuickQuizWidget.tsx | Remove pulse loop |
| src/pages/Goals.tsx | Plain div |
| src/pages/Fintech.tsx | Plain div |
| src/pages/Achievements.tsx | Plain div |
| src/pages/HabitCategory.tsx | Plain div |
| vite.config.ts | Add dedupe |

## What Stays

- Bottom nav active pill slide (lightweight, premium)
- Sheet/dialog entrance animations (handled by Radix, not custom)
- Progress bar fills (functional feedback)
- `whileTap={{ scale: 0.95 }}` on important action buttons only (brief, no spring)
- Drag gesture on tasbih beads (core functionality)
- AnimatedCheckmark component (small, functional)

