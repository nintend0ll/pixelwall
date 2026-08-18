# Pixel Wall — Interactive Pixel Art Gallery

A beautiful, interactive pixel art gallery built into your portfolio. Visitors can draw tiny 8-bit icons on a 16x16 grid and see their creations displayed in a permanent masonry gallery.

## Features

- **16x16 Pixel Canvas**: Draw with a 16-color palette
- **Persistent Gallery**: All submissions are stored in Supabase and displayed forever
- **Masonry Grid Layout**: Responsive gallery that adapts to different screen sizes
- **Terminal-Style UI**: Retro aesthetic with CRT monitor vibes
- **Accent Color**: Beautiful lavender (#b4befe) accent throughout the design

## Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase account (free tier works great)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
# or
pnpm install
```

2. Set up your Supabase database:
   - Create a Supabase project at https://supabase.com
   - Create a new table called `pixel_drawings` with the following schema:

   ```sql
   create table pixel_drawings (
     id uuid primary key default gen_random_uuid(),
     pixels text not null,
     artist text default 'anon',
     title text default 'untitled',
     created_at timestamp default now()
   );

   create index pixel_drawings_created_at on pixel_drawings(created_at desc);
   ```

   - Enable Row Level Security (RLS) and set up a policy to allow public inserts:

   ```sql
   alter table pixel_drawings enable row level security;

   create policy "Allow public insert" on pixel_drawings
   for insert
   with check (true);

   create policy "Allow public select" on pixel_drawings
   for select
   with check (true);
   ```

3. Create a `.env` file in the project root with your Supabase credentials:

```bash
cp .env.example .env
```

Then update it with your actual Supabase URL and anon key:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Running Locally

```bash
npm run dev
# or
pnpm dev
```

Visit http://localhost:5173 to see your pixel wall.

## Building

```bash
npm run build
# or
pnpm build
```

## Color Palette

The default 16-color palette includes:

- 0: Transparent (empty)
- 1: Almost Black (#0b0f10)
- 2: Off-White (#f4f4f0)
- 3: Slate Gray (#8b93a1)
- 4: Red (#e8443a)
- 5: Orange (#f58b3c)
- 6: Yellow (#ffd447)
- 7: Lime Green (#9ee34a)
- 8: Green (#3fd07a)
- 9: Teal (#2bb3a3)
- 10: Lavender - **Accent Color** (#b4befe)
- 11: Sky Blue (#4aa8f0)
- 12: Blue (#3b5bd6)
- 13: Purple (#8a5cf0)
- 14: Magenta (#e05fd6)
- 15: Pink (#f79ac0)

## Technology Stack

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Tailwind CSS**: Styling
- **TanStack React Query**: Data fetching and caching
- **Supabase**: Backend database and authentication
- **Vitest**: Testing framework (for future tests)

## Project Structure

```
src/
├── components/
│   ├── PixelEditor.tsx    # The drawing canvas
│   ├── PixelThumb.tsx     # Gallery thumbnail renderer
│   └── palette.ts         # Color palette and utilities
├── integrations/
│   └── supabase/
│       └── client.ts      # Supabase configuration
├── App.tsx                # Main application component
├── App.css                # Custom styles
├── index.css              # Global styles and Tailwind imports
└── main.tsx               # Entry point
```

## File Storage Format

Drawings are stored as a 256-character hex string representing a 16x16 grid (256 pixels total). Each character is a hex digit (0-f) representing the color index from the palette.

## Future Enhancements

- [ ] Add ability to edit/delete your own submissions
- [ ] Share individual drawings via URL
- [ ] Animated pixel grid effect
- [ ] Sound effects for drawing
- [ ] Daily featured drawing rotation
- [ ] Export drawings as PNG

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
