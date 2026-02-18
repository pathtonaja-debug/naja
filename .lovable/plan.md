

# Make Practices Tab More Compact

## Current Issues
- Each Fard prayer card is very tall (~80px) with large icons and generous padding
- The progress card, disclaimer, and tab selector together take significant space above the fold
- The "More Practices" grid at the bottom uses large icon cards
- Sunnah prayer cards are similarly oversized
- Sadaqah cards have large expanded areas
- Users must scroll significantly to see all content

## Changes

### 1. Compact the Progress Summary (inline it with the tab selector)
- Move the "0/5 Fard" progress into the same row as the tab selector header, removing the separate Card wrapper
- Replace the thick progress bar with a slim 2px version
- Remove the standalone "Sunnah prayers completed" text line; fold it into a small badge

### 2. Shrink Fard Prayer Rows
- Reduce each prayer card from a full Card with p-4 to a slim list-row style (py-2.5 px-3)
- Reduce icon size from w-10 h-10 to w-8 h-8
- Remove the card wrapper around each prayer; use a single Card for the whole list with dividers
- Keep the on-time/congregation/qada buttons but make them smaller chips (py-1.5)

### 3. Shrink Sunnah Prayer Rows
- Same treatment: single Card container, slim rows with dividers
- Show rakats inline with the name instead of in a separate column

### 4. Compact the "More Practices" Grid
- Change from a 4-column card grid with large icons to a horizontal scrollable row of small chips/pills
- Each chip: icon + label, no card border, smaller footprint

### 5. Compact Sadaqah Tab
- Reduce sadaqah type card padding
- Smaller icons (w-8 h-8 instead of w-10 h-10)

### 6. Move disclaimer
- Move the niyyah disclaimer to the very bottom of the page instead of between the tabs and content

---

### Technical Details

**Files changed:** `src/pages/Practices.tsx` (single file edit)

**Key changes:**
- Fard prayers: Replace individual `<Card>` per prayer with one wrapping `<Card>` containing divider-separated rows. Reduce padding from `p-4` to `py-2.5 px-3`. Icons from `w-10 h-10` to `w-8 h-8`.
- Sunnah prayers: Same single-Card approach with slim rows.
- Progress section: Remove `<Card>` wrapper, inline progress as a slim bar directly below the tab selector.
- "More Practices" grid: Convert from `grid grid-cols-4` of Cards to a `flex gap-2 overflow-x-auto` row of pill buttons.
- Sadaqah cards: Reduce icon from `w-10 h-10` to `w-8 h-8`, padding from `p-4` to `p-3`.
- Move disclaimer `<p>` to bottom of the page content.
- Reduce `space-y-4` gaps to `space-y-3` throughout.

**No new files, no new dependencies, no storage keys changed.**

**Routes affected:** `/practices`

**Manual test checklist:**
- Tap each Fard prayer to mark done; verify on-time/congregation/qada chips appear and work
- Tap each Sunnah prayer to toggle
- Tap "More Practices" pills to navigate to Quran/Dhikr/Dua/Sadaqah
- Switch to Sadaqah tab; expand a type and log one
- Verify the page feels noticeably shorter and more scannable
- Test in both light and dark mode

