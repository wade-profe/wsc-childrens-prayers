# WSC Children's Prayers

A simple cross-platform (iOS + Android) app presenting the 107 children's prayers
from the Westminster Shorter Catechism, one per screen.

- **Swipe left** → next prayer, **swipe right** → previous (bounded at 1 and 107).
- **All Prayers** menu to jump to any prayer.
- Prayer text auto-sizes to fill the screen without being cut off.
- Remembers your place across restarts (local storage).
- Automatic light/dark mode.

## Run

```
npm install
```

```
npx expo start
```

Then scan the QR code with **Expo Go** (Android) or the Camera app (iOS), or press
`i` / `a` to launch an iOS simulator / Android emulator.

## Regenerate prayer data

Prayer text lives in `assets/prayers.json`, generated from the source PDF:

```
python3 scripts/parse_prayers.py
```

(Requires `pypdf`: `pip3 install pypdf`.)

## Project layout

```
App.tsx                     navigation + theming
src/screens/PrayerPager.tsx swipeable one-prayer-per-screen pager
src/screens/PrayerMenu.tsx  full prayer list
src/components/FitText.tsx  auto-fitting prayer text
src/storage.ts              persists current position
src/theme.ts                light/dark palettes
src/data/prayers.ts         typed prayer data
assets/prayers.json         the 107 prayers
scripts/parse_prayers.py    PDF → JSON parser
```
