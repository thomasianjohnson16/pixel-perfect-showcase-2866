/** Single source of content for /exercises and /exercises/$slug. */
export type Exercise = {
  slug: string; name: string; title: string; h1: string; answer: string;
  time: string; reps: string; safety: string; who: string; steps: string[];
  stop: string; related: string[]; isoTime: string | null; videoId: string; kind: "dog" | "cat";
};

export const exercises: Exercise[] = [
  {
    "slug": "bicycle-legs",
    "name": "Bicycle Legs",
    "title": "Bicycle Legs: Gentle Exercise for Stiff Hips in Older Dogs",
    "h1": "Bicycle Legs: a gentle range-of-motion exercise for stiff old hips",
    "answer": "Bicycle legs is a passive stretch where you slowly bend and straighten your dog's legs while they lie relaxed on their side. It keeps stiff hips, knees and elbows moving without your dog having to bear any weight.",
    "time": "3 min",
    "reps": "10 slow cycles per leg",
    "safety": "Ask your vet to show you once",
    "who": "Dogs who are stiff after lying down, or too sore for standing exercises.",
    "steps": [
      "Your pet lies relaxed on their side on a soft mat.",
      "Support the leg just above and just below the joint.",
      "Slowly bend the joint until you feel the first gentle resistance. Stop there.",
      "Slowly straighten it again. Then the next joint, then the other side."
    ],
    "stop": "Pulling the leg away, lip-licking, tensing or turning to look at you means you've gone too far.",
    "related": [
      "cookie-stretches",
      "sit-to-stand"
    ],
    "isoTime": "PT3M",
    "videoId": "ex1",
    "kind": "dog"
  },
  {
    "slug": "cookie-stretches",
    "name": "Cookie Stretches",
    "title": "Cookie Stretches: Easy Back Stretch for Senior Dogs",
    "h1": "Cookie stretches: a treat-led stretch for a stiff back",
    "answer": "Cookie stretches use a treat to guide your dog's head round towards their hip and down between their front legs. It gently stretches a stiff neck, back and sides, and most dogs love it.",
    "time": "2 min",
    "reps": "3 each side, hold 3 to 5 seconds",
    "safety": "Safe for most seniors",
    "who": "Dogs with a stiff back or neck, or who struggle to turn round or curl up.",
    "steps": [
      "Your pet stands square on a non-slip mat.",
      "Hold a treat at their nose and slowly draw it round towards their hip.",
      "Hold for 3 to 5 seconds, then give the treat. Repeat on the other side.",
      "Finish with the treat drawn down between the front legs (chin to chest)."
    ],
    "stop": "If they walk round in a circle instead of bending, you've lured too far. Shorten the arc.",
    "related": [
      "bicycle-legs",
      "figure-of-eight"
    ],
    "isoTime": "PT2M",
    "videoId": "ex2",
    "kind": "dog"
  },
  {
    "slug": "sit-to-stand",
    "name": "Sit-to-Stand",
    "title": "Sit-to-Stand: Best Exercise for Old Dogs with Weak Back Legs",
    "h1": "Sit-to-stand: the best home exercise for weak back legs",
    "answer": "Sit-to-stand is a dog squat: your dog sits, then stands up slowly for a treat, then sits again. It builds the back-leg muscles older dogs use every time they get up off the floor.",
    "time": "2 min",
    "reps": "5 reps, building to 10",
    "safety": "Safe for most seniors",
    "who": "Dogs who struggle to get up, push up with their front legs, or have weak or wobbly back legs.",
    "steps": [
      "Back your pet's rear against the sofa or into a corner so they sit straight.",
      "Ask for a sit.",
      "Hold a treat at nose height just in front and lure them slowly up to standing.",
      "Ask for a sit again. That's one rep. Slow and tidy beats fast."
    ],
    "stop": "Sitting crooked or hauling up with the front legs: use the corner and do fewer reps.",
    "related": [
      "down-to-sit",
      "weight-shifts"
    ],
    "isoTime": "PT2M",
    "videoId": "ex3",
    "kind": "dog"
  },
  {
    "slug": "down-to-sit",
    "name": "Down-to-Sit",
    "title": "Down-to-Sit: Front Leg Strength Exercise for Senior Dogs",
    "h1": "Down-to-sit: front-leg push-ups for older dogs",
    "answer": "Down-to-sit moves your dog from lying down to sitting up and back again, like a gentle push-up. It strengthens the front legs and shoulders your dog needs to get up from the floor.",
    "time": "2 min",
    "reps": "5 reps, building to 10",
    "safety": "Safe for most seniors",
    "who": "Dogs who find getting up from lying down hard work.",
    "steps": [
      "Start with your pet lying down, sphinx-style, on a non-slip mat.",
      "Lift a treat slowly up and slightly back so they push up into a sit.",
      "Lure the treat down to the floor between their paws so they lie down again.",
      "That's one rep. Reward every second or third rep."
    ],
    "stop": "If getting up from lying is already hard, keep reps very low and build slowly.",
    "related": [
      "sit-to-stand",
      "cushion-stand"
    ],
    "isoTime": "PT2M",
    "videoId": "ex4",
    "kind": "dog"
  },
  {
    "slug": "weight-shifts",
    "name": "Weight Shifts",
    "title": "Weight Shifts: Balance Exercise for Dogs with Slipping Back Legs",
    "h1": "Weight shifts: a gentle balance exercise for back legs that slip",
    "answer": "Weight shifts are tiny, gentle nudges at your dog's hips and shoulders that make them push back to stay balanced. It trains the small stabilising muscles that stop back legs slipping.",
    "time": "2 min",
    "reps": "10 gentle nudges",
    "safety": "Safe for most seniors",
    "who": "Dogs whose back legs slip on floors or who look wobbly standing still.",
    "steps": [
      "Your pet stands square on a non-slip mat.",
      "Rest your hands lightly on their hips.",
      "Nudge a tiny amount to one side so they push back against you. Hold 2 to 3 seconds.",
      "Alternate sides, then do the same at the shoulders."
    ],
    "stop": "If they step or wobble, you're pushing too hard. It's a nudge, never a shove.",
    "related": [
      "cushion-stand",
      "sit-to-stand"
    ],
    "isoTime": "PT2M",
    "videoId": "ex5",
    "kind": "dog"
  },
  {
    "slug": "broomstick-poles",
    "name": "Broomstick Poles",
    "title": "DIY Cavaletti for Dogs: Broomstick Pole Exercise at Home",
    "h1": "Broomstick poles: DIY cavaletti for older dogs at home",
    "answer": "Broomstick poles are a home version of cavaletti: your dog walks slowly over broom handles laid on the floor. It makes them lift each paw higher, which helps dogs who scuff or drag their back feet.",
    "time": "3 min",
    "reps": "4 to 6 slow passes",
    "safety": "Safe for most seniors",
    "who": "Dogs who scuff their back paws, trip on steps, or have lost coordination.",
    "steps": [
      "Lay 4 to 6 broom handles, canes or rolled towels flat on the floor.",
      "Space them about the height from the floor to your pet's shoulder.",
      "Walk your pet slowly across on a loose lead. Walking pace only.",
      "Turn and walk back. That's one pass."
    ],
    "stop": "Tripping or knocking poles: lower them, widen the gaps, or slow down.",
    "related": [
      "figure-of-eight",
      "weight-shifts"
    ],
    "isoTime": "PT3M",
    "videoId": "ex6",
    "kind": "dog"
  },
  {
    "slug": "figure-of-eight",
    "name": "Figure-of-Eight Walks",
    "title": "Figure-of-Eight Walks: Flexibility Exercise for Senior Dogs",
    "h1": "Figure-of-eight walks: bending and turning for stiff older dogs",
    "answer": "Figure-of-eight walks take your dog in slow loops around two cushions or chairs. The turns bend the spine both ways and work the muscles that straight-line walks miss.",
    "time": "2 min",
    "reps": "5 loops each way",
    "safety": "Safe for most seniors",
    "who": "Dogs who walk stiffly or seem to turn more easily one way than the other.",
    "steps": [
      "Place two cushions or chairs about two pet-lengths apart.",
      "Walk your pet slowly in a figure-of-eight around them on a loose lead.",
      "Keep the pace slow and even.",
      "Change direction halfway so both sides get the same work."
    ],
    "stop": "Cutting corners, stumbling or swinging the back end out: make the loops wider.",
    "related": [
      "broomstick-poles",
      "cookie-stretches"
    ],
    "isoTime": "PT2M",
    "videoId": "ex7",
    "kind": "dog"
  },
  {
    "slug": "cushion-stand",
    "name": "Cushion Stand",
    "title": "Cushion Stand: Balance Exercise for Old Dogs with Wobbly Legs",
    "h1": "Cushion stand: a simple balance exercise for wobbly older dogs",
    "answer": "The cushion stand has your dog stand with their front paws, then all four, on a firm sofa cushion. The soft surface makes them use their core and leg muscles to stay steady.",
    "time": "2 min",
    "reps": "3 holds of 10 to 20 seconds",
    "safety": "Skip if your dog has balance or nerve problems",
    "who": "Dogs who are a bit wobbly but steady enough to stand on a soft surface.",
    "steps": [
      "Put a firm sofa cushion or folded duvet on the floor against a wall.",
      "Lure just the front paws onto it. Hold 10 seconds, then treat.",
      "When that's easy, lure all four paws on and hold.",
      "Stay close with a hand ready to steady them."
    ],
    "stop": "Wobbling a lot or jumping off: go back to front paws only.",
    "related": [
      "weight-shifts",
      "down-to-sit"
    ],
    "isoTime": "PT2M",
    "videoId": "ex8",
    "kind": "dog"
  },
  {
    "slug": "cat-wand-play",
    "name": "Slow-Mo Wand Play",
    "title": "Exercise for Senior Cats: Slow-Motion Wand Play",
    "h1": "Slow-mo wand play: gentle exercise for older cats",
    "answer": "Older cats don't do reps, but they still love to hunt. Slow, floor-level wand play gets a senior cat stalking, pouncing and moving without the leaping that jars sore joints.",
    "time": "3 to 5 min",
    "reps": "2 to 3 times a day",
    "safety": "Safe for most senior cats",
    "who": "Senior cats who have slowed down or play less than they used to.",
    "steps": [
      "Play on carpet for grip.",
      "Move a wand toy slowly along the floor so they stalk it.",
      "Let them swat and catch it often. Winning keeps them interested.",
      "Keep it at ground level: chasing and pouncing, not leaping."
    ],
    "stop": "Short and fun beats long and forced. Stop while they still want more.",
    "related": [
      "cat-step-up-staircase",
      "cat-treat-trail"
    ],
    "isoTime": "PT5M",
    "videoId": "cat-a",
    "kind": "cat"
  },
  {
    "slug": "cat-step-up-staircase",
    "name": "Step-Up Staircase",
    "title": "Senior Cat Can't Jump? Build a Step-Up Staircase",
    "h1": "Step-up staircase: for older cats who've stopped jumping",
    "answer": "A step-up staircase is a low, sturdy set of steps (a stool, then a box, then the sofa) that lets an older cat climb to their favourite spot instead of jumping. It builds strength with far less jolting on sore joints.",
    "time": "Set up once",
    "reps": "Use daily",
    "safety": "Safe for most senior cats",
    "who": "Cats who have stopped jumping onto the bed, sofa or windowsill, or hesitate before they jump.",
    "steps": [
      "Build a low, sturdy staircase to a favourite spot.",
      "A stool, then a box, then the sofa. Nothing that wobbles.",
      "Put a treat on each step so they step up instead of jumping.",
      "Controlled strength, and far less jolting on sore joints."
    ],
    "stop": "If a step wobbles or they hesitate, make the steps lower and wider.",
    "related": [
      "cat-treat-trail",
      "cat-wand-play"
    ],
    "isoTime": null,
    "videoId": "cat-b",
    "kind": "cat"
  },
  {
    "slug": "cat-treat-trail",
    "name": "Treat Trail & Reach",
    "title": "Treat Trail: Easy Daily Exercise and Stretch for Older Cats",
    "h1": "Treat trail and reach: a walk and a full stretch for senior cats",
    "answer": "A treat trail is a line of single kibbles around the room that ends with a treat held just above your cat's head. It gets an older cat walking, sniffing and finishing with a full-body stretch.",
    "time": "2 to 3 min",
    "reps": "Use their daily food",
    "safety": "Safe for most senior cats",
    "who": "Older cats who sleep most of the day and move very little.",
    "steps": [
      "Lay a trail of single kibbles around the room.",
      "They walk the trail, sniffing out each piece.",
      "At the end, hold a treat just above head height.",
      "They stretch up tall to reach it. A full spine stretch."
    ],
    "stop": "Use food from their daily ration, so the treats don't add weight.",
    "related": [
      "cat-step-up-staircase",
      "cat-wand-play"
    ],
    "isoTime": "PT3M",
    "videoId": "cat-c",
    "kind": "cat"
  }
];

export const getExercise = (slug: string) => exercises.find((e) => e.slug === slug);
