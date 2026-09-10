import type { Metadata } from "next";
import { GuideLink, GuideSection, PracticeGuide } from "@/components/learn/PracticeGuide";

const title = "A beginner driving range practice plan";
const description = "Start with ten recorded shots, one iron, and a smaller swing. A simple range practice plan to compare contact before chasing distance.";
const path = "/learn/beginner-driving-range-practice";

export const metadata: Metadata = {
  title, description, alternates: { canonical: path },
  openGraph: { type: "article", title, description, url: `https://dovegolf.fit${path}` },
  twitter: { card: "summary_large_image", title, description },
};

export default function BeginnerRangePracticePage() {
  return <PracticeGuide title={title} description="If you’re new to golf, a bucket of balls can feel like a lot of chances to get confused. Give the next ten shots one job: see whether a smaller swing helps you make contact." path={path} club="iron">
    <GuideSection title="Before you hit: choose one club and one goal">
      <p>Allow about 10–15 minutes after you have settled in and warmed up at your own pace. Choose a club marked 9, PW, or SW if you have one, or an iron you feel comfortable holding. Ask range staff if you need help choosing a club or understanding the hitting area.</p>
      <p>For this practice, success means noticing what happened. You do not need a distance target, a launch monitor, or swing terminology. Stay inside your bay, check that nobody is within reach of the club, and stop if swinging hurts.</p>
    </GuideSection>
    <GuideSection title="First five balls: write down what you actually see">
      <p>Use your current comfortable swing. After every attempt, choose one result: the ball went into the air; you hit it but it stayed on the ground; you missed; or you could not tell. Count all five attempts, including misses. If the ball rolled, that still counts as contact.</p>
      <p>A note can be as simple as “air, ground, miss, air, ground.” That set gives you four contacts and two airborne shots. The airborne shots count as contact too. If you could not see a result, mark it unclear instead of guessing.</p>
    </GuideSection>
    <GuideSection title="One change: rehearse a smaller swing">
      <p>Put the next ball aside. Make three gentle swings without a ball, letting your hands travel only to about waist height on each side. Feel the club lightly brush the mat or grass and finish standing comfortably. You do not need to scoop the ball upward.</p>
      <p>Keep your club and ball position the same. If you started with a low tee, keep that same tee setup for the next set. Changing the club, setup, and swing together would make it harder to tell what helped.</p>
    </GuideSection>
    <GuideSection title="Next five balls: repeat the task, then compare">
      <p>Take five shots using that smaller swing and record each attempt in the same way. Compare how many touched the ball and how many got into the air. For example, moving from two to three airborne shots is something to repeat next time; it is not proof that you have fixed your swing.</p>
      <p>If contact improves, keep the same club and small swing for another session before adding distance. If you still miss every ball, ask a range instructor to help with setup and contact. If the results were unclear, a companion watching from safely outside the swing area may help you observe the next set.</p>
    </GuideSection>
    <GuideSection title="What should you practice next?">
      <p>You can stop after the comparison. You do not have to finish with a perfect shot. Save a short note about the club, setup, and what you observed so your next visit starts with a clear task.</p>
      <p>Ready to practice tee shots? Use the separate <GuideLink href="/learn/driver-practice-for-beginners">beginner driver practice plan</GuideLink>. If contact is becoming repeatable and direction is your question, learn to <GuideLink href="/learn/start-line-vs-curve">separate the ball’s start line from its curve</GuideLink>. Those are different observations from whether the ball got airborne.</p>
    </GuideSection>
  </PracticeGuide>;
}
