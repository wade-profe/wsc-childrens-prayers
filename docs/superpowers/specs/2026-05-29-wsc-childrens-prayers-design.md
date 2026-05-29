# WSC Children's Prayers — Design

A cross-platform (iOS + Android) React Native app that presents the 107 children's
prayers from the Westminster Shorter Catechism, one per screen.

## Goals

- One prayer per full screen, swipe to navigate.
- A menu to jump to any prayer.
- Prayer text as large as possible without clipping.
- Remember the user's place across app restarts.
- Automatic light/dark mode.

## Stack

- **Expo** (managed workflow), TypeScript.
- **React Navigation** (native-stack) — two screens: pager + menu.
- **@react-native-async-storage/async-storage** — persist current position.
- **react-native-safe-area-context** — edge padding.

## Data

Prayers are extracted from `wsc-childrens-prayers.md.pdf` at build time by
`scripts/parse_prayers.py` into `assets/prayers.json`:

```json
{ "q": 1, "question": "What is the main purpose of mankind?", "prayer": "Dear God, ... Amen." }
```

The parser splits on `Q<n>.` markers, identifies the type line
(Thanksgiving/Petition/Confession) to delimit question vs. prayer, normalizes
`fi`/`fl` ligatures, strips the attribution footer from Q107, and asserts exactly
107 entries numbered 1–107 each ending in "Amen." The app imports the JSON; no
runtime PDF parsing. (Per design choice, the type label is parsed but not displayed.)

## Components

- **App.tsx** — `NavigationContainer` themed from `useColorScheme()`, native-stack
  with `Pager` and `Menu` screens.
- **src/theme.ts** — light/dark palettes + `getTheme(scheme)`.
- **src/data/prayers.ts** — typed import of `prayers.json`.
- **src/storage.ts** — `loadIndex()` / `saveIndex()` (best-effort, validated range).
- **src/components/FitText.tsx** — renders text at the largest font size (binary
  search between min/max) that fits its container height without vertical clipping;
  hidden until size settles to avoid flicker.
- **src/screens/PrayerPager.tsx** — horizontal `pagingEnabled` `FlatList`, one
  full-width page per prayer. Swipe left → next, right → previous; bounded at the
  ends by the list itself. Each page: question header + `FitText` prayer body, with
  safe-area padding. Header shows `N / 107` and an "All Prayers" button. Loads the
  stored index for `initialScrollIndex`; saves on every page settle; jumps to a
  prayer when returning from the menu via the `goToIndex` route param.
- **src/screens/PrayerMenu.tsx** — `FlatList` of all 107 ("`n.` question"), tap to
  navigate back to the pager at that index.

## Behavior details

- Swipe right on prayer 1 / left on prayer 107 do nothing (FlatList bounds).
- Position saved on `onMomentumScrollEnd` and on menu selection.
- Theme follows the OS appearance automatically (no manual toggle).

## Out of scope

- Search, bookmarks, font-size settings, audio, sharing.
