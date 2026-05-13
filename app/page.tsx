"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CirclePause,
  CirclePlay,
  Clock3,
  HeartHandshake,
  HelpCircle,
  Home,
  Leaf,
  ListChecks,
  MessageCircle,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserRound
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Screen =
  | "welcome"
  | "signup"
  | "child"
  | "questions"
  | "routine"
  | "dashboard"
  | "prepare"
  | "activity"
  | "pause"
  | "refusal"
  | "complete"
  | "tomorrow";

const steps = [
  "Place 6 cotton balls and one small bowl on the table.",
  "Show your child how to pinch one cotton ball with thumb and finger.",
  "Invite them to move it into the bowl. One try is enough to begin.",
  "Pause after each try and notice effort: 'You gave your fingers a turn.'"
];

const upcoming = [
  { title: "Sticker peel", time: "4 min", prep: "stickers" },
  { title: "Sponge squeeze", time: "5 min", prep: "small sponge" },
  { title: "Thread big beads", time: "6 min", prep: "string + beads" }
];

const navItems = [
  { label: "Today", icon: Home },
  { label: "Plan", icon: CalendarDays },
  { label: "Progress", icon: ListChecks },
  { label: "Support", icon: MessageCircle }
];

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [activityStep, setActivityStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [refusalHandled, setRefusalHandled] = useState(false);

  const progress = useMemo(() => ((activityStep + 1) / steps.length) * 100, [activityStep]);

  const goDashboard = () => {
    setScreen("dashboard");
    setActivityStep(0);
    setPaused(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-3 sm:p-8">
      <section className="relative h-[812px] max-h-[calc(100vh-24px)] w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-white/70 bg-background shadow-soft">
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-background/90 px-5 pb-3 pt-5 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">NestSteps</p>
              <p className="text-xs text-muted-foreground">Parent companion</p>
            </div>
          </div>
          <Badge className="bg-white/80">Fine motor V1</Badge>
        </div>

        <div className="phone-scroll h-full overflow-y-auto px-5 pb-24 pt-20">
          {screen === "welcome" && <Welcome onNext={() => setScreen("signup")} />}
          {screen === "signup" && (
            <Signup onBack={() => setScreen("welcome")} onNext={() => setScreen("child")} />
          )}
          {screen === "child" && (
            <ChildProfile onBack={() => setScreen("signup")} onNext={() => setScreen("questions")} />
          )}
          {screen === "questions" && (
            <Questions onBack={() => setScreen("child")} onNext={() => setScreen("routine")} />
          )}
          {screen === "routine" && (
            <Routine onBack={() => setScreen("questions")} onNext={goDashboard} />
          )}
          {screen === "dashboard" && <Dashboard onStart={() => setScreen("prepare")} />}
          {screen === "prepare" && (
            <Prepare onBack={goDashboard} onStart={() => setScreen("activity")} />
          )}
          {screen === "activity" && (
            <Activity
              step={activityStep}
              progress={progress}
              paused={paused}
              refusalHandled={refusalHandled}
              onBack={() => setScreen("prepare")}
              onTogglePause={() => {
                setPaused((value) => !value);
                setScreen(paused ? "activity" : "pause");
              }}
              onRefusal={() => setScreen("refusal")}
              onHelp={() => setScreen("pause")}
              onNext={() => {
                if (activityStep === steps.length - 1) {
                  setScreen("complete");
                } else {
                  setActivityStep((value) => value + 1);
                }
              }}
            />
          )}
          {screen === "pause" && (
            <Pause
              onResume={() => {
                setPaused(false);
                setScreen("activity");
              }}
              onRefusal={() => setScreen("refusal")}
            />
          )}
          {screen === "refusal" && (
            <Refusal
              onBack={() => setScreen("activity")}
              onTryGentle={() => {
                setRefusalHandled(true);
                setScreen("activity");
              }}
              onFinish={() => setScreen("complete")}
            />
          )}
          {screen === "complete" && (
            <Complete onTomorrow={() => setScreen("tomorrow")} onDashboard={goDashboard} />
          )}
          {screen === "tomorrow" && <Tomorrow onStart={() => setScreen("prepare")} />}
        </div>

        {["dashboard", "tomorrow"].includes(screen) && <BottomNav />}
      </section>
    </main>
  );
}

function ScreenHeader({
  eyebrow,
  title,
  body,
  icon: Icon
}: {
  eyebrow: string;
  title: string;
  body: string;
  icon: typeof Leaf;
}) {
  return (
    <div className="mb-5">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
        <Icon className="h-7 w-7" />
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-bold leading-tight tracking-normal text-foreground">{title}</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex min-h-[650px] flex-col justify-between">
      <div>
        <ScreenHeader
          eyebrow="A calm start"
          title="Small hand-skill moments, guided for you."
          body="NestSteps helps you run short at-home activities with simple setup, kind prompts, and room for hard moments."
          icon={HeartHandshake}
        />
        <div className="mt-8 grid gap-3">
          {[
            "Only fine motor activities in this V1",
            "Built for parents before, during, and after",
            "Pause, resume, or end gently any time"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg bg-white/80 p-4">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <Button size="lg" className="w-full" onClick={onNext}>
        Create parent account
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Signup({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <FlowShell
      step="1 of 4"
      title="Tell us where to send your plan."
      body="No pressure to get everything perfect. You can change details later."
      onBack={onBack}
    >
      <FormField label="Your name" value="Maya Patel" />
      <FormField label="Email" value="maya@example.com" />
      <FormField label="Password" value="••••••••" />
      <Button size="lg" className="mt-4 w-full" onClick={onNext}>
        Continue
        <ChevronRight className="h-4 w-4" />
      </Button>
    </FlowShell>
  );
}

function ChildProfile({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <FlowShell
      step="2 of 4"
      title="Set up your child’s activity profile."
      body="We use this to keep activities short, doable, and matched to daily life."
      onBack={onBack}
    >
      <FormField label="Child's first name" value="Ari" />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Age" value="4 years" />
        <FormField label="Best session" value="Morning" />
      </div>
      <ChoiceGrid choices={["Likes quiet play", "Needs movement first", "Prefers sitting near parent"]} />
      <Button size="lg" className="mt-4 w-full" onClick={onNext}>
        Continue
        <ChevronRight className="h-4 w-4" />
      </Button>
    </FlowShell>
  );
}

function Questions({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <FlowShell
      step="3 of 4"
      title="A few simple hand-skill questions."
      body="Choose what feels closest today. This is not a test."
      onBack={onBack}
    >
      <QuestionCard
        question="How does picking up small items usually go?"
        options={["Needs help starting", "Can try a few times", "Usually manages"]}
      />
      <QuestionCard
        question="What happens when an activity feels hard?"
        options={["Turns away", "Asks for help", "Keeps trying briefly"]}
      />
      <Button size="lg" className="mt-4 w-full" onClick={onNext}>
        Continue
        <ChevronRight className="h-4 w-4" />
      </Button>
    </FlowShell>
  );
}

function Routine({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <FlowShell
      step="4 of 4"
      title="Pick a gentle daily rhythm."
      body="We’ll plan one short activity at a time so the day does not feel crowded."
      onBack={onBack}
    >
      <ChoiceGrid choices={["After breakfast", "Before lunch", "After nap", "Before bedtime"]} />
      <Card className="mt-4 bg-white/80">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Moon className="mt-1 h-5 w-5 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground">
              We’ll keep reminders soft: “Ready for a 5-minute hand-skill moment?”
            </p>
          </div>
        </CardContent>
      </Card>
      <Button size="lg" className="mt-4 w-full" onClick={onNext}>
        See today
        <ChevronRight className="h-4 w-4" />
      </Button>
    </FlowShell>
  );
}

function Dashboard({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground">Good morning, Maya</p>
      <h1 className="mt-1 text-3xl font-bold">Today’s hand-skill session is ready.</h1>

      <Card className="mt-5 overflow-hidden bg-white">
        <div className="bg-[linear-gradient(135deg,#f8d8b8_0%,#f7efd9_48%,#cbe5dd_100%)] p-4">
          <Badge className="border-white/60 bg-white/70">5 minutes • low prep</Badge>
          <h2 className="mt-12 text-2xl font-bold">Cotton ball pinch-and-drop</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/70">
            Practice gentle thumb-and-finger pinching with a calm, easy-to-stop activity.
          </p>
        </div>
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Streak" value="3 days" />
            <Stat label="Progress" value="68%" />
            <Stat label="Next" value="4 min" />
          </div>
          <Button size="lg" className="mt-4 w-full" onClick={onStart}>
            Start guided session
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Upcoming activities</h2>
          <span className="text-xs font-semibold text-primary">This week</span>
        </div>
        <div className="grid gap-3">
          {upcoming.map((item) => (
            <Card key={item.title} className="bg-white/80">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.time} • {item.prep}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function Prepare({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <FlowShell
      step="Before you begin"
      title="Set up only what you need."
      body="This activity can be done at a table, on the floor, or wherever your child feels settled."
      onBack={onBack}
    >
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Gather these</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {["6 cotton balls", "1 small bowl or cup", "A clear spot beside you"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="mt-4 border-primary/20 bg-primary/10">
        <CardContent className="pt-4">
          <p className="text-sm leading-6">
            Parent cue: “We’ll move a few soft balls together. You can stop whenever your body says stop.”
          </p>
        </CardContent>
      </Card>
      <Button size="lg" className="mt-4 w-full" onClick={onStart}>
        Begin steps
        <CirclePlay className="h-4 w-4" />
      </Button>
    </FlowShell>
  );
}

function Activity({
  step,
  progress,
  paused,
  refusalHandled,
  onBack,
  onTogglePause,
  onRefusal,
  onHelp,
  onNext
}: {
  step: number;
  progress: number;
  paused: boolean;
  refusalHandled: boolean;
  onBack: () => void;
  onTogglePause: () => void;
  onRefusal: () => void;
  onHelp: () => void;
  onNext: () => void;
}) {
  return (
    <FlowShell
      step={`Step ${step + 1} of ${steps.length}`}
      title="Stay close and go slowly."
      body="You are guiding the moment. The goal is a calm try, not a perfect finish."
      onBack={onBack}
    >
      <div className="mb-4">
        <Progress value={progress} />
      </div>
      <Card className="bg-white">
        <CardContent className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <Badge className="bg-accent">About 1 minute</Badge>
            <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              03:20
            </div>
          </div>
          <p className="text-2xl font-bold leading-snug">{steps[step]}</p>
          {refusalHandled && (
            <p className="mt-4 rounded-lg bg-secondary p-3 text-sm leading-6">
              Gentle version is on. One tiny try, watching only, or stopping all count today.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button variant="outline" className="h-14 flex-col gap-1 text-xs" onClick={onTogglePause}>
          {paused ? <CirclePlay className="h-5 w-5" /> : <CirclePause className="h-5 w-5" />}
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button variant="outline" className="h-14 flex-col gap-1 text-xs" onClick={onHelp}>
          <HelpCircle className="h-5 w-5" />
          Help
        </Button>
        <Button variant="outline" className="h-14 flex-col gap-1 text-xs" onClick={onRefusal}>
          <ShieldCheck className="h-5 w-5" />
          Refusal
        </Button>
      </div>
      <Button size="lg" className="mt-4 w-full" onClick={onNext}>
        {step === steps.length - 1 ? "Finish session" : "Next step"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </FlowShell>
  );
}

function Pause({ onResume, onRefusal }: { onResume: () => void; onRefusal: () => void }) {
  return (
    <div>
      <ScreenHeader
        eyebrow="Paused"
        title="Take the space you both need."
        body="A quiet break is still part of the activity. Come back when it feels easier."
        icon={CirclePause}
      />
      <div className="grid gap-3">
        <Button size="lg" onClick={onResume}>
          Resume where we left off
          <CirclePlay className="h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" onClick={onRefusal}>
          My child does not want to continue
          <ShieldCheck className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Refusal({
  onBack,
  onTryGentle,
  onFinish
}: {
  onBack: () => void;
  onTryGentle: () => void;
  onFinish: () => void;
}) {
  return (
    <FlowShell
      step="Child refusal"
      title="It is okay to stop or make it smaller."
      body="Refusal is information. You can protect trust and still mark today as supported."
      onBack={onBack}
    >
      <div className="grid gap-3">
        <SupportOption title="Watch only" body="Let your child watch you move one cotton ball." />
        <SupportOption title="One tiny turn" body="Invite one touch, then stop with warmth." />
        <SupportOption title="End calmly" body="Say: “Thanks for telling me. We can try another day.”" />
      </div>
      <Button size="lg" className="mt-4 w-full" onClick={onTryGentle}>
        Try a gentler version
        <Sparkles className="h-4 w-4" />
      </Button>
      <Button size="lg" variant="outline" className="mt-3 w-full" onClick={onFinish}>
        End and save note
        <Check className="h-4 w-4" />
      </Button>
    </FlowShell>
  );
}

function Complete({
  onTomorrow,
  onDashboard
}: {
  onTomorrow: () => void;
  onDashboard: () => void;
}) {
  return (
    <div>
      <ScreenHeader
        eyebrow="Session complete"
        title="You showed up with patience today."
        body="Ari practiced finger control in a short, supported way. Small repeats help hands learn over time."
        icon={Sparkles}
      />
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Time" value="5 min" />
            <Stat label="Tries" value="4" />
            <Stat label="Mood" value="Calm" />
          </div>
          <div className="mt-4 rounded-lg bg-secondary p-4">
            <p className="text-sm font-semibold">Progress note</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Today’s activity supported pinch strength and hand planning. Even watching and touching once can build comfort.
            </p>
          </div>
        </CardContent>
      </Card>
      <Button size="lg" className="mt-4 w-full" onClick={onTomorrow}>
        Preview tomorrow
        <CalendarDays className="h-4 w-4" />
      </Button>
      <Button size="lg" variant="ghost" className="mt-2 w-full" onClick={onDashboard}>
        Back to dashboard
      </Button>
    </div>
  );
}

function Tomorrow({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <ScreenHeader
        eyebrow="Next day"
        title="Welcome back. We’ll keep it light today."
        body="Yesterday counted. Today’s plan is another short hand-skill activity with a fresh start."
        icon={RotateCcw}
      />
      <Card className="bg-white">
        <CardContent className="p-4">
          <Badge>4 minutes • low prep</Badge>
          <h2 className="mt-4 text-xl font-bold">Sticker peel practice</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Help Ari peel a large sticker from the corner and place it on paper. Stop after a few tries.
          </p>
          <Button size="lg" className="mt-4 w-full" onClick={onStart}>
            Start today’s session
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function FlowShell({
  step,
  title,
  body,
  onBack,
  children
}: {
  step: string;
  title: string;
  body: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{step}</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">{title}</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{body}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <label className="mb-3 block">
      <span className="mb-2 block text-sm font-semibold text-muted-foreground">{label}</span>
      <input
        className="h-12 w-full rounded-lg border border-border bg-white px-4 text-base font-medium outline-none ring-primary/30 focus:ring-4"
        value={value}
        readOnly
      />
    </label>
  );
}

function ChoiceGrid({ choices }: { choices: string[] }) {
  return (
    <div className="grid gap-2">
      {choices.map((choice, index) => (
        <button
          key={choice}
          className={cn(
            "flex min-h-12 items-center justify-between rounded-lg border bg-white px-4 text-left text-sm font-semibold",
            index === 0 ? "border-primary text-primary" : "border-border"
          )}
          type="button"
        >
          {choice}
          {index === 0 && <Check className="h-4 w-4" />}
        </button>
      ))}
    </div>
  );
}

function QuestionCard({ question, options }: { question: string; options: string[] }) {
  return (
    <Card className="mb-3 bg-white">
      <CardContent className="p-4">
        <p className="mb-3 font-semibold leading-6">{question}</p>
        <ChoiceGrid choices={options} />
      </CardContent>
    </Card>
  );
}

function SupportOption({ title, body }: { title: string; body: string }) {
  return (
    <Card className="bg-white/90">
      <CardContent className="p-4">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/70 p-3">
      <p className="text-sm font-bold">{value}</p>
      <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="absolute inset-x-4 bottom-4 z-20 grid grid-cols-4 rounded-2xl border border-white/70 bg-white/90 p-2 shadow-lg backdrop-blur">
      {navItems.map(({ label, icon: Icon }, index) => (
        <button
          key={label}
          className={cn(
            "flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold",
            index === 0 ? "bg-secondary text-primary" : "text-muted-foreground"
          )}
          type="button"
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </nav>
  );
}
