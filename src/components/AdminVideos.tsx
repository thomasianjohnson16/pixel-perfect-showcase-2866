import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminCreateVideoUpload, adminListVideos } from "@/lib/orders.functions";

type Video = { name: string; size: number; created_at: string | null; url: string };

const mb = (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`;

export function AdminVideos({ password }: { password: string }) {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const load = async () => {
    const r = await adminListVideos({ data: { password } }).catch(() => ({ ok: false as const, error: "Could not load videos." }));
    if (r.ok) setVideos(r.videos);
    else setMsg(r.error);
  };
  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const results: string[] = [];
    for (const file of Array.from(files)) {
      if (!/\.mp4$/i.test(file.name) || (file.type && file.type !== "video/mp4")) {
        results.push(`${file.name}: skipped (not an MP4)`);
        continue;
      }
      setMsg(`Uploading ${file.name}…`);
      const s = await adminCreateVideoUpload({ data: { password, name: file.name } }).catch(() => ({ ok: false as const, message: "Could not start upload." }));
      if (!s.ok) { results.push(`${file.name}: ${s.message}`); continue; }
      const { error } = await supabase.storage.from("videos").uploadToSignedUrl(s.path, s.token, file, { contentType: "video/mp4", upsert: true });
      results.push(error ? `${file.name}: upload failed (${error.message})` : `${file.name}: uploaded`);
    }
    setBusy(false);
    setMsg(results.join(" · "));
    if (input.current) input.current.value = "";
    void load();
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold">Videos</h2>
      <label
        htmlFor="video-upload"
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void upload(e.dataTransfer.files); }}
        className={`mt-4 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${drag ? "border-forest bg-sage" : "border-ink/20 bg-card"}`}
      >
        <span className="font-medium">{busy ? "Uploading…" : "Drop MP4 files here or click to choose"}</span>
        <span className="mt-1 text-ink/60">Original file names are kept. A file with the same name is replaced.</span>
        <input id="video-upload" ref={input} type="file" accept="video/mp4,.mp4" multiple disabled={busy}
          className="sr-only" onChange={(e) => void upload(e.target.files)} />
      </label>
      {msg && <p role="status" className="mt-3 text-ink/70">{msg}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-card shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-sage">
            <tr>{["File", "Size", "Uploaded", "Link"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {videos?.map((v) => (
              <tr key={v.name} className="border-t border-ink/5">
                <td className="break-all px-4 py-3">{v.name}</td>
                <td className="whitespace-nowrap px-4 py-3">{mb(v.size)}</td>
                <td className="whitespace-nowrap px-4 py-3">{v.created_at ? new Date(v.created_at).toLocaleString("en-IE") : "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <a href={v.url} target="_blank" rel="noreferrer" className="underline">Open</a>
                  <button type="button" onClick={() => void navigator.clipboard.writeText(v.url)} className="ml-3 underline">Copy link</button>
                </td>
              </tr>
            ))}
            {videos?.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-ink/60">No videos yet.</td></tr>}
            {!videos && <tr><td colSpan={4} className="px-4 py-8 text-center text-ink/60">Loading…</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
