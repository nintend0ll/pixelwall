import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PixelEditor } from "@/components/PixelEditor";
import { PixelThumb } from "@/components/PixelThumb";
import { EMPTY_DRAWING, isBlank } from "@/components/palette";
import "./App.css";

const TITLE = "pixel wall — agustina@";
const DESCRIPTION =
  "Draw a tiny 8-bit icon on a 16x16 grid and leave it on the wall. A growing gallery of drawings made by visitors of agustina's terminal.";

type Drawing = {
  id: string;
  pixels: string;
  artist: string;
  title: string;
  created_at: string;
  approved: boolean;
};

export default function App() {
  const queryClient = useQueryClient();
  const [pixels, setPixels] = useState(EMPTY_DRAWING);
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  );

  // Update document title and meta tags
  if (typeof document !== "undefined") {
    document.title = TITLE;
    // Update OG tags
    const setMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`,
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(name.includes(":") ? "property" : "name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMetaTag("description", DESCRIPTION);
    setMetaTag("og:title", TITLE);
    setMetaTag("og:description", DESCRIPTION);
  }

  const { data: drawings = [], isLoading } = useQuery({
    queryKey: ["drawings"],
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<Drawing[]> => {
      const { data, error } = await supabase
        .from("pixel_drawings")
        .select("id, pixels, artist, title, created_at, approved")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return data ?? [];
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (!isSupabaseConfigured) {
        throw new Error(
          "Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.",
        );
      }

      const { error } = await supabase.from("pixel_drawings").insert({
        pixels,
        artist: (artist.trim() || "anon").slice(0, 24),
        title: (title.trim() || "untitled").slice(0, 32),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setStatus("drawing submitted for review :)");
      setPixels(EMPTY_DRAWING);
      setTitle("");
      void queryClient.invalidateQueries({ queryKey: ["drawings"] });
    },
    onError: (error: Error) => setStatus(`error: ${error.message}`),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (isBlank(pixels)) {
      setStatus("error: canvas is empty, draw something first");
      return;
    }
    if (!isSupabaseConfigured) {
      setStatus(
        "error: add your Supabase keys to .env to enable saving artwork",
      );
      return;
    }
    submit.mutate();
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="pixel-wall-header rounded-sm">
        <div className="terminal-header">
          <span className="terminal-dot dot-close" />
          <span className="terminal-dot dot-minimize" />
          <span className="terminal-dot dot-maximize" />
          <span className="ml-2 text-muted-foreground">
            makiroll@agustina: ~/pixel-wall
          </span>
        </div>
        <div className="px-5 py-8 sm:px-8">
          <p className="text-xs text-muted-foreground">
            makiroll@agustina:~$ ./pixel-wall --draw
          </p>
          <h1 className="crt-title mt-3 text-5xl leading-none accent-primary sm:text-7xl">
            pixel wall
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            a 16x16 grid, sixteen colors, and whatever you feel like leaving
            behind. every icon drawn here stays on the wall forever
            <span className="blink-caret ml-1 accent-primary" />
          </p>
        </div>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <form
          onSubmit={onSubmit}
          className="h-fit rounded-sm border border-border bg-card p-5 lg:sticky lg:top-6"
        >
          <h2 className="crt-title text-2xl accent-primary">new_icon.png</h2>
          <div className="mt-4">
            <PixelEditor pixels={pixels} onChange={setPixels} />
          </div>

          <div className="mt-5 space-y-3">
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              nickname
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                maxLength={24}
                placeholder="anon"
                className="form-input mt-1 w-full"
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={32}
                placeholder="untitled"
                className="form-input mt-1 w-full"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submit.isPending}
            className="btn-primary mt-5 w-full"
          >
            {submit.isPending ? "uploading..." : "commit to wall"}
          </button>

          {status ? (
            <p
              className={`mt-3 text-xs ${
                status.startsWith("error")
                  ? "text-destructive"
                  : "accent-primary"
              }`}
            >
              &gt; {status}
            </p>
          ) : null}
        </form>

        <div>
          <div className="flex items-baseline justify-between border-b border-border pb-2">
            <h2 className="crt-title text-2xl accent-primary">the wall</h2>
            <span className="text-xs text-muted-foreground">
              {isLoading ? "loading..." : `${drawings.length} drawings`}
            </span>
          </div>

          {!isLoading && drawings.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              wall is empty. approved drawings will appear here.
            </p>
          ) : (
            <ul className="pixel-gallery mt-4">
              {drawings.map((d: Drawing) => (
                <li key={d.id} className="gallery-card group">
                  <div className="rounded-sm bg-background p-1">
                    <PixelThumb pixels={d.pixels} className="pixel-thumb" />
                  </div>
                  <p className="mt-2 truncate text-xs text-foreground">
                    {d.title}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    by {d.artist}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <footer className="mt-12 border-t border-border pt-4 text-xs text-muted-foreground">
        makiroll@agustina:~$ just coding for fun
      </footer>
    </main>
  );
}
