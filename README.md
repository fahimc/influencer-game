# StarSpark Live

StarSpark Live is a bright, kid-safe rhythm and creator simulation game for web and Android. Players mix seven performance moves, catch the beat, build combos, and earn fictional likes, views, comments, and gifts during a short live show.

This is an original fictional game. It is not affiliated with TikTok or any other social platform.

## Play

- Click **Start show** or press `Enter`.
- Pick an outfit before going live; milestone rewards unlock more looks.
- Use the seven on-screen move buttons or keyboard keys `1`–`7`.
- Switch moves to grow the combo; repeating a move cools it down.
- Use **Silly** and **Robot** moves to boost views.
- Tap the shield on an unkind simulated comment before it lowers popularity and viewers.
- Reach 10, 100, and 1,000 career views and likes to unlock stars, rewards, and outfits.
- Hit a move while the beat orb flashes for a timing bonus.
- Press `Space` to pause or resume.

The best score is stored only on the current device.

## Kid-safety design

- No account or sign-in
- No real chat or user-generated content; all comments and moderation choices are simulated
- No camera or microphone access
- No ads, purchases, or external links in the game
- All audience names, comments, likes, views, and gifts are fictional

## Web development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run build
npm run lint
npm test
```

## Android

The Android wrapper uses Capacitor 8 and targets Android API 36.

```bash
npm run android:sync
cd android
gradlew.bat assembleDebug
```

The APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`. Building locally requires JDK 21 and the Android SDK.

## Project structure

- `app/StarSparkGame.tsx` — shared game logic and interface
- `app/globals.css` — responsive game art, animation, and layout
- `mobile/` — static mobile entry point
- `android/` — native Android wrapper
- `public/og.png` — original generated social artwork

## License

Source code is provided under the MIT License. Generated artwork is included for use with this project.
