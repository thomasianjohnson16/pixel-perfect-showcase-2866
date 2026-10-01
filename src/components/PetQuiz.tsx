import { useState } from "react";
import { Cat, Dog, PawPrint, Check } from "lucide-react";
import { useCheckout } from "@/components/Checkout";

type Pet = "Dog" | "Cat" | null;

const SIGNS = [
  ["Slow to get up", "being slow to get up"],
  ["Hesitates at stairs or jumps", "hesitating at stairs or jumps"],
  ["Slips on smooth floors", "slipping on smooth floors"],
  ["Shorter walks or less play", "shorter walks or less play"],
  ["Stiff after naps", "stiffness after naps"],
] as const;
const FLAGS = ["Crying or yelping when moving", "Suddenly not using a leg", "A hot or swollen joint", "Recent surgery"];
const NONE = "None of these";
const AGES = ["Under 7", "7–10", "11–13", "14+"];
const TOTAL = 5;

function joinList(items: string[]) {
  if (items.length <= 1) return items.join("");
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

const optBtn = (on: boolean) =>
  `flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left font-medium transition ${
    on ? "border-forest bg-sage" : "border-ink/10 bg-card hover:border-forest/40"
  }`;
const amberBtn = "btn-amber w-full sm:w-auto";

export function PetQuiz() {
  const { buy } = useCheckout();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [name, setName] = useState("");
  const [pet, setPet] = useState<Pet>(null);
  const [age, setAge] = useState<string | null>(null);
  const [signs, setSigns] = useState<string[]>([]);
  const [flags, setFlags] = useState<string[]>([]);

  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => {
    if (v === NONE) return set(list.includes(NONE) ? [] : [NONE]);
    const base = list.filter((x) => x !== NONE);
    set(base.includes(v) ? base.filter((x) => x !== v) : [...base, v]);
  };
  const reset = () => { setName(""); setPet(null); setAge(null); setSigns([]); setFlags([]); setDir(-1); setStep(0); };

  const n = name.trim();
  if (typeof window !== "undefined" && step === TOTAL) { try { sessionStorage.setItem("sp_pet", JSON.stringify({ name: n, pet })); } catch {} }
  const Name = n || `your ${(pet ?? "pet").toLowerCase()}`;
  const NameCap = n || `Your ${(pet ?? "pet").toLowerCase()}`;
  const possessive = n ? `${n}'s` : "your";
  const Icon = pet === "Cat" ? Cat : pet === "Dog" ? Dog : PawPrint;
  const progress = Math.min(step, TOTAL) / TOTAL;

  const realSigns = signs.filter((s) => s !== NONE);
  const hasFlag = flags.some((f) => f !== NONE);
  const plainSigns = realSigns.map((s) => SIGNS.find(([l]) => l === s)![1]);

  const multiQ = (list: string[], set: (v: string[]) => void, opts: string[]) => (
    <>
      <p className="mb-4 text-sm text-ink/60">Choose all that apply</p>
      <div className="space-y-3">
        {[...opts, NONE].map((o) => {
          const on = list.includes(o);
          return (
            <button key={o} type="button" onClick={() => toggle(list, set, o)} className={optBtn(on)} aria-pressed={on}>
              {o}
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? "border-forest bg-forest text-cream" : "border-ink/20"}`}>
                {on && <Check className="h-4 w-4" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );

  const next = (label = "Next", disabled = false) => (
    <button type="button" disabled={disabled} onClick={() => go(step + 1)} className={`${amberBtn} mt-6 disabled:opacity-40`}>
      {label}
    </button>
  );

  let body: React.ReactNode;
  if (step === 0) {
    body = (
      <>
        <h3 className="text-2xl font-semibold">What's your pet's name?</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 30))}
          onKeyDown={(e) => e.key === "Enter" && go(1)}
          placeholder="e.g. Bella"
          maxLength={30}
          className="mt-6 w-full rounded-2xl border-2 border-ink/10 bg-card px-5 py-4 text-lg outline-none focus:border-forest"
        />
        <p className="mt-2 text-xs text-ink/50">Optional</p>
        {next(n ? "Next" : "Skip")}
      </>
    );
  } else if (step === 1) {
    body = (
      <>
        <h3 className="text-2xl font-semibold">Dog or cat?</h3>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {(["Dog", "Cat"] as const).map((p) => {
            const I = p === "Dog" ? Dog : Cat;
            return (
              <button key={p} type="button" onClick={() => { setPet(p); go(2); }} className={`${optBtn(pet === p)} flex-col justify-center py-6`}>
                <I className="h-8 w-8 text-forest" strokeWidth={1.5} />{p}
              </button>
            );
          })}
        </div>
      </>
    );
  } else if (step === 2) {
    body = (
      <>
        <h3 className="text-2xl font-semibold">How old {n ? "is " + n : "are they"}?</h3>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {AGES.map((a) => (
            <button key={a} type="button" onClick={() => { setAge(a); go(3); }} className={`${optBtn(age === a)} justify-center`}>{a}</button>
          ))}
        </div>
      </>
    );
  } else if (step === 3) {
    body = (
      <>
        <h3 className="mb-1 text-2xl font-semibold">Which have you noticed?</h3>
        {multiQ(signs, setSigns, SIGNS.map(([l]) => l))}
        {next("Next", signs.length === 0)}
      </>
    );
  } else if (step === 4) {
    body = (
      <>
        <h3 className="mb-1 text-2xl font-semibold">Any of these right now?</h3>
        {multiQ(flags, setFlags, FLAGS)}
        {next("See my result", flags.length === 0)}
      </>
    );
  } else if (hasFlag) {
    body = (
      <div className="rounded-2xl border-l-4 border-amber bg-amber/10 p-6">
        <h3 className="text-2xl font-semibold">Please see your vet first.</h3>
        <p className="mt-3 text-ink/80">
          {NameCap} is showing signs that need a vet's eyes before starting any exercise plan. Once your vet gives the all-clear, this guide will be here.
        </p>
        <a href="#inside" className="mt-5 inline-block text-sm font-medium text-forest underline underline-offset-4">Have a look at the guide</a>
      </div>
    );
  } else {
    const strong = realSigns.length >= 2;
    body = (
      <>
        <h3 className="text-2xl font-semibold leading-snug">
          {strong ? `This guide was made for ${Name}.` : `${NameCap} is doing well. Let's keep it that way.`}
        </h3>
        <p className="mt-3 text-ink/75">
          {strong
            ? `You noticed ${joinList(plainSigns)}. Those are exactly what the 28-day plan targets.`
            : "Gentle strength and balance work now helps older pets stay mobile for longer. The plan includes easier and harder versions, so it grows with them."}
        </p>
        {strong && (
          <div className="mt-5 rounded-2xl bg-sage p-5">
            <p className="text-sm font-semibold text-forest">Where {Name} would start:</p>
            <p className="mt-1">{pet === "Cat" ? "Slow-Mo Wand Play and the Step-Up Staircase" : "Sit-to-Stand and Cookie Stretches in week 1"}</p>
          </div>
        )}
        <button type="button" onClick={buy} className={`${amberBtn} mt-6`}>Get {possessive} 28-day plan – €14</button>
        <p className="mt-3 text-sm text-ink/60">30-day money-back guarantee</p>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="text-center text-3xl font-semibold leading-tight sm:text-4xl">
        Is this guide right for my pet? <span className="block text-lg font-normal text-ink/60 sm:inline">(30 seconds)</span>
      </h2>
      <div className="mt-8 overflow-hidden rounded-3xl bg-card shadow-soft">
        <div className="h-1.5 bg-sage">
          <div className="h-full bg-amber transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="p-6 sm:p-9">
          <div className="mb-5 flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage">
              <Icon className="h-6 w-6 text-forest" strokeWidth={1.5} />
            </span>
            {step < TOTAL && <span className="text-xs font-medium text-ink/50">{step + 1} / {TOTAL}</span>}
          </div>
          <div key={step} className={`animate-in fade-in duration-300 ${dir === 1 ? "slide-in-from-right-8" : "slide-in-from-left-8"}`}>
            {body}
          </div>
          <div className="mt-6 text-sm">
            {step > 0 && step < TOTAL && (
              <button type="button" onClick={() => go(step - 1)} className="font-medium text-forest underline-offset-4 hover:underline">← Back</button>
            )}
            {step === TOTAL && (
              <button type="button" onClick={reset} className="font-medium text-forest underline-offset-4 hover:underline">Start again</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
