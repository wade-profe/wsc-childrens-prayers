# Building & Installing the App

This is an **Expo (managed workflow)** app. There are three ways to get it onto a
device, from quickest to most production-ready:

1. **Expo Go** — fastest, for development/testing. No build required.
2. **EAS Build (cloud)** — produces real installable binaries (APK / AAB / IPA) without needing Xcode or Android Studio locally. Recommended for sharing/stores.
3. **Local builds** — compile on your own machine (needs Android Studio and/or Xcode).

---

## 0. Prerequisites

```
node --version    # 18+ (this project was built on Node 22)
```

```
npm install
```

Run all commands from the project root (`wsc-childrens-prayers/`).

---

## 1. Expo Go (development — quickest)

Best for iterating. Runs the JS bundle inside the Expo Go container app.

```
npx expo start
```

- **Physical phone:** install **Expo Go** (Play Store / App Store), then scan the QR code in the terminal (Android: scan from inside Expo Go; iOS: scan with the Camera app).
- **Android emulator:** press `a` (requires an emulator running — see Android Studio setup).
- **iOS simulator:** press `i` (requires Xcode on macOS).

Phone and computer must be on the same network. No build step — this is not a standalone install.

---

## 2. EAS Build (cloud — recommended for real installs)

Builds in Expo's cloud, so you don't need native toolchains locally. Requires a
free Expo account.

### One-time setup

```
npm install -g eas-cli
```

```
eas login
```

```
eas build:configure
```

`eas build:configure` creates an `eas.json` with build profiles. A minimal setup
that produces a directly-installable Android **APK** (instead of a Play-Store AAB)
under a `preview` profile:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {}
  }
}
```

### Android

Installable APK for sideloading / sharing:

```
eas build --platform android --profile preview
```

Production app bundle (AAB) for the Play Store:

```
eas build --platform android --profile production
```

When the build finishes, EAS prints a URL. **Install the APK** by either:

- Opening the URL on the phone and tapping the download (enable "install from unknown sources"), or
- Downloading the `.apk` and running:

```
adb install path/to/app.apk
```

### iOS

iOS device installs require an **Apple Developer account** ($99/yr) for code
signing. Without one you can still build for the **simulator** only.

Build for a real device / TestFlight:

```
eas build --platform ios --profile production
```

EAS will walk you through Apple credentials. Distribute the resulting build via
**TestFlight** (see Submit below) or an ad-hoc internal profile.

Build for the iOS **simulator** (no Apple account needed):

```
eas build --platform ios --profile preview
```

Then run it on a booted simulator:

```
eas build:run --platform ios --latest
```

### Submit to the stores (optional)

```
eas submit --platform android --latest
```

```
eas submit --platform ios --latest
```

Or build and auto-submit in one step by adding `-s` to `eas build`.

---

## 3. Local builds (no EAS cloud)

Compile natively on your machine. Expo generates the native projects on the fly
(`prebuild`).

### Android (needs Android Studio + SDK; works on macOS/Windows/Linux)

Build and install onto a connected device / running emulator:

```
npx expo run:android
```

Release variant:

```
npx expo run:android --variant release
```

This produces an APK under `android/app/build/outputs/apk/`.

Alternatively, run an EAS build profile locally (still needs the native toolchain):

```
eas build --platform android --profile preview --local
```

### iOS (needs Xcode; macOS only)

Build and install onto a simulator / connected device:

```
npx expo run:ios
```

For a physical device you must open the generated `ios/` project in Xcode once to
set up signing (Apple ID), then run from Xcode or:

```
npx expo run:ios --device
```

---

## Which should I use?

| Goal | Use |
|------|-----|
| Quick testing while developing | Expo Go (`npx expo start`) |
| Share an installable Android file with someone | EAS `preview` (APK) |
| Put it on the Play Store / App Store | EAS `production` + `eas submit` |
| Build entirely on your own machine | `npx expo run:android` / `run:ios` |

> iOS device installs always require an Apple Developer account for signing;
> Android APKs can be sideloaded freely.
