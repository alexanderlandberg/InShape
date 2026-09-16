# InShape

Personal, single-user PWA for logging home workouts, biking, and VR sessions —
XP/levels, personal bests, badges, calorie estimates, calendar history, and
body weight tracking.

Next.js (App Router) + TypeScript + SCSS + Firebase Firestore, deployed on Vercel.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires a `.env.local` with `NEXT_PUBLIC_FIREBASE_*` config values from a
Firestore project (Native mode, open rules — see project plan for setup steps).
Visit `/dev/seed` once to push the seed exercises and "Workout 1".
