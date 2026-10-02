/** Public URL for a demo video in the public "videos" bucket. */
export function videoUrl(file: string) {
  const base = import.meta.env["VITE_SUPABASE_URL"] as string;
  return `${base}/storage/v1/object/public/videos/${encodeURIComponent(file)}`;
}

export const demoVideos = [
  { id: "ex1", badge: "1", file: "01-bicycle-legs.mp4", title: "Exercise 1: Bicycle Legs" },
  { id: "ex2", badge: "2", file: "02-cookie-stretches.mp4", title: "Exercise 2: Cookie Stretches" },
  { id: "ex3", badge: "3", file: "03-sit-to-stand.mp4", title: "Exercise 3: Sit-to-Stand" },
  { id: "ex4", badge: "4", file: "04-down-to-sit.mp4", title: "Exercise 4: Down-to-Sit" },
  { id: "ex5", badge: "5", file: "05-weight-shifts.mp4", title: "Exercise 5: Weight Shifts" },
  { id: "ex6", badge: "6", file: "06-broomstick-poles.mp4", title: "Exercise 6: Broomstick Poles" },
  { id: "ex7", badge: "7", file: "07-figure-of-eight.mp4", title: "Exercise 7: Figure-of-Eight Walks" },
  { id: "ex8", badge: "8", file: "08-cushion-stand.mp4", title: "Exercise 8: Cushion Stand" },
  { id: "cat-a", badge: "A", file: "cat-a-wand-play.mp4", title: "Cat A: Slow-Mo Wand Play" },
  { id: "cat-b", badge: "B", file: "cat-b-step-up-staircase.mp4", title: "Cat B: Step-Up Staircase" },
  { id: "cat-c", badge: "C", file: "cat-c-treat-trail.mp4", title: "Cat C: Treat Trail & Reach" },
] as const;
