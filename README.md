# Plate

Cross-platform workout tracker and fitness social app inspired by Hevy. Plate is built to make logging gym sessions, tracking strength progression, and staying consistent effortless—while bringing a social layer to share workouts and connect with other lifters.

> **Note:** Early-stage project in active development.

## Tech Stack

- **[Expo](https://expo.dev/)**
- **[React Native](https://reactnative.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Expo Router](https://docs.expo.dev/router/introduction/)**
- **[Supabase](https://supabase.com/)** (Auth & PostgreSQL)

## Database Schema

Plate uses PostgreSQL on Supabase with Row Level Security (RLS) enabled across all tables.

![Plate Database Schema](./docs/images/schema-db.svg)

For full details on tables, constraints, indexes, triggers, and RLS policies, see [docs/schema-db.md](./docs/schema-db.md).

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/marioswc/plate.git
   cd plate
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

   *(Or with npm: `npm install`)*

3. **Start the development server**

   ```bash
   npx expo start
   ```

   From the terminal, you can open the app in the **iOS Simulator**, **Android Emulator**, **Expo Go**, or a **Development Build**.
