import type { Metadata } from "next";
import { GuideLink, GuideSection, PracticeGuide } from "@/components/learn/PracticeGuide";

const title = "Driver practice for beginners: build a calmer tee shot";
const description = "Try a simple beginner driver drill: five starting tee shots, three shorter rehearsals, and five comparison shots with the same setup.";
const path = "/learn/driver-practice-for-beginners";

export const metadata: Metadata = {
  title, description, alternates: { canonical: path },
  openGraph: { type: "article", title, description, url: `https://dovegolf.fit${path}` },
  twitter: { card: "summary_large_image", title, description },
};

export default function BeginnerDriverPracticePage() {
  return <PracticeGuide title={title} description="Start with contact from the tee. This short driver session compares five comfortable swings with five shorter, easier swings, while keeping your setup consistent." path={path} club="driver">
    <GuideSection title="Set up the tee shot before counting balls">
      <p>Use your driver and a tee intended for it. Ask range staff to help choose a suitable tee height if you are unsure. Warm up at your own pace before starting the comparison; the ten recorded shots are a practice block, not a warm-up requirement.</p>
      <p>Place the ball forward in your stance, near the inside of your lead heel. Your lead foot is the foot closer to the target, whichever hand you play with. Stand comfortably, bend from your hips, and set the driver behind the ball. Keep others outside your swing area and stop if swinging hurts.</p>
      <p>Choose your tee height and ball position now, then keep them unchanged for both sets. This is a contact experiment, so you are not trying to find an ideal launch angle or maximum distance.</p>
    </GuideSection>
    <GuideSection title="Record five comfortable tee shots">
      <p>Hit five balls with your current comfortable swing. Record each attempt as airborne, contact along the ground, missed, or unclear. A ball starting on a raised tee does not count as airborne: it needs to fly above the ground beyond the tee, even briefly.</p>
      <p>Do not discard a miss or add a replacement shot. Those attempts are part of your starting point. If you could not see what happened, record that honestly. You can use the guided recorder below or a short note on your phone.</p>
    </GuideSection>
    <GuideSection title="Rehearse a shorter swing above the ground">
      <p>Without a ball, make three easy swings with a shorter backswing than usual. Let the driver travel above the mat or grass and finish comfortably in balance. You are rehearsing a teed shot; do not copy the ground-brushing exercise from iron practice.</p>
      <p>Then take five more tee shots with that shorter, easy swing. Keep the same driver, tee height, and ball position. If you need to change the setup, start a new comparison with five fresh starting shots rather than comparing two different setups.</p>
    </GuideSection>
    <GuideSection title="Read the result without chasing height">
      <p>Count contact and airborne shots in each set. A starting set with three contacts and one airborne ball compared with five contacts and three airborne balls gives you a useful observation to repeat. Five shots is a small sample; it does not establish a lasting improvement.</p>
      <p>Getting more balls into the air does not tell you whether your driver flight is too high, whether you hit the center of the face, or whether a slice is corrected. Keep those questions separate. For now, repeat a comfortable setup and look for contact you can reproduce.</p>
    </GuideSection>
    <GuideSection title="Choose the next session from what happened">
      <p>If the shorter swing helped contact, repeat it next visit before adding speed. If you are still missing, ask a range instructor to watch your setup and a few swings. When observations are unclear, get a clearer starting set instead of treating uncertain shots as success or failure.</p>
      <p>If the ball repeatedly curves, use the <GuideLink href="/tools/ball-flight-decoder">Ball Flight Decoder</GuideLink> to describe its start, curve, and strike. For a separate session with a shorter club, try the <GuideLink href="/learn/beginner-driving-range-practice">beginner iron practice plan</GuideLink>. Finish with one next step you can remember, rather than several new swing instructions.</p>
    </GuideSection>
  </PracticeGuide>;
}
