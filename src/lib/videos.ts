/** Public URL for a demo video in the public "videos" bucket. */
/** Public video URL without the first-frame hint (for structured data). */
export function videoFileUrl(file: string) {
  return `${import.meta.env["VITE_SUPABASE_URL"] as string}/storage/v1/object/public/videos/${encodeURIComponent(file)}`;
}

export function videoUrl(file: string) {
  const base = import.meta.env["VITE_SUPABASE_URL"] as string;
  return `${base}/storage/v1/object/public/videos/${encodeURIComponent(file)}#t=0.1`;
}

export const demoVideos = [
  { id: "ex1", badge: "1", file: "01-bicycle-legs.mp4", title: "Exercise 1: Bicycle Legs" , description: "Gently cycle your dog's legs while they lie on their side to keep hips and knees moving.", uploadDate: "2026-10-02T12:31:23Z" },
  { id: "ex2", badge: "2", file: "02-cookie-stretches.mp4", title: "Exercise 2: Cookie Stretches" , description: "Lure your dog's nose toward each hip with a treat for a slow, gentle side stretch.", uploadDate: "2026-10-02T12:31:30Z" },
  { id: "ex3", badge: "3", file: "03-sit-to-stand.mp4", title: "Exercise 3: Sit-to-Stand" , description: "Lure your dog from sit to stand and back again to build rear-leg strength.", uploadDate: "2026-10-02T12:31:34Z" },
  { id: "ex4", badge: "4", file: "04-down-to-sit.mp4", title: "Exercise 4: Down-to-Sit" , description: "Ask your dog to move from lying down to sitting to strengthen the front legs and core.", uploadDate: "2026-10-02T12:31:39Z" },
  { id: "ex5", badge: "5", file: "05-weight-shifts.mp4", title: "Exercise 5: Weight Shifts" , description: "Gently nudge your standing dog side to side and front to back to build balance.", uploadDate: "2026-10-02T12:31:48Z" },
  { id: "ex6", badge: "6", file: "06-broomstick-poles.mp4", title: "Exercise 6: Broomstick Poles" , description: "Walk your dog slowly over low broom handles to encourage higher, steadier steps.", uploadDate: "2026-10-02T12:31:55Z" },
  { id: "ex7", badge: "7", file: "07-figure-of-eight.mp4", title: "Exercise 7: Figure-of-Eight Walks" , description: "Walk your dog in slow figure-of-eight loops to work both sides of the body evenly.", uploadDate: "2026-10-02T12:32:01Z" },
  { id: "ex8", badge: "8", file: "08-cushion-stand.mp4", title: "Exercise 8: Cushion Stand" , description: "Have your dog stand with front paws on a firm cushion to build balance and core strength.", uploadDate: "2026-10-02T12:32:07Z" },
  { id: "cat-a", badge: "A", file: "cat-a-wand-play.mp4", title: "Cat A: Slow-Mo Wand Play" , description: "Move a wand toy slowly so your cat stretches, reaches and steps at a gentle pace.", uploadDate: "2026-10-02T12:32:12Z" },
  { id: "cat-b", badge: "B", file: "cat-b-step-up-staircase.mp4", title: "Cat B: Step-Up Staircase" , description: "Use treats to encourage your cat up a few low, stable steps to keep legs strong.", uploadDate: "2026-10-02T12:32:19Z" },
  { id: "cat-c", badge: "C", file: "cat-c-treat-trail.mp4", title: "Cat C: Treat Trail & Reach" , description: "Lay a short trail of treats, some placed up high, so your cat walks and reaches.", uploadDate: "2026-10-02T12:32:24Z" },
] as const;
