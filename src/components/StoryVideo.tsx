import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import reel from "@/assets/steady-paws-hero-reel.mp4.asset.json";
import poster from "@/assets/hero-cover.webp.asset.json";

/** Self-hosted reel: plays muted only while in view, pauses when out of view. */
export function StoryVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          if (!reduce || !v.muted) void v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) void v.play().catch(() => {});
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <video
        ref={ref}
        src={reel.url}
        poster={poster.url}
        muted
        loop
        playsInline
        preload="none"
        width={1080}
        height={1920}
        aria-label="27-second video: an older golden retriever slowing down, and how gentle daily exercise can help"
        onClick={toggle}
        className="aspect-[9/16] w-full cursor-pointer rounded-3xl bg-sage object-cover shadow-soft"
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!muted}
        className="absolute bottom-4 left-1/2 inline-flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-ink/75 px-4 text-base font-medium text-cream backdrop-blur"
      >
        {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
        {muted ? "Tap for sound" : "Sound on"}
      </button>
    </div>
  );
}
