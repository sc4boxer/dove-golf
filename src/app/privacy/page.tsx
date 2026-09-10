import type { Metadata } from "next";
import { HomeLinkPill } from "@/components/HomeLinkPill";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Dove Golf handles optional practice accounts, saved practice, analytics, and anonymous product feedback.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <HomeLinkPill />

        <header className="mt-12 border-b border-slate-200 pb-10">
          <p className="eyebrow">Plain-language notice</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Privacy at Dove Golf</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            You can use Dove Golf without an account. Practice accounts, browser-only practice history,
            analytics, and product feedback are separate choices. Participation in analytics and product feedback is optional.
          </p>
          <p className="mt-4 text-sm text-slate-500">Last updated September 9, 2026</p>
        </header>

        <div className="space-y-10 py-10 text-base leading-7 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">What we collect</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li><strong>Optional analytics:</strong> If you allow analytics, Google Analytics may collect page views, session activity, approximate location, and broad browser or device information.</li>
              <li><strong>Optional product feedback:</strong> The module used, selected miss, whether the guidance helped, an optional golf-experience range, what topic you want next, and an optional comment.</li>
              <li><strong>Optional practice account:</strong> If you create or sign in to a practice account, Supabase stores your email and authentication information. Completed guided practice can be saved with your account identifier, club, completion date, and two sets of five recorded outcomes.</li>
              <li><strong>Optional putting leaderboard:</strong> If you post a score, your three-character initials, score, date and rank are public. We process your shot sequence to verify the score and store the result, course edition and a hashed round token. No account or email is needed.</li>
              <li><strong>Basic technical processing:</strong> Our hosting and security providers may temporarily process request information such as IP address and user agent to deliver and protect the site. Dove Golf does not add those fields to the product-feedback table.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">What anonymous feedback does not request</h2>
            <p className="mt-4">The feedback form does not ask for your name, email, exact age, precise location, account, swing video, or persistent visitor identifier. Please do not put personal information in the optional comment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Why we use it</h2>
            <p className="mt-4">Saved practice supports your next-practice suggestion, practice series, and weekly challenge. An optional account makes that history available when you sign in on another device. We use analytics and product feedback to understand whether a module was clear, find confusing steps, prioritize future modules, measure basic site performance, and protect the service from misuse. We do not sell personal information or use Dove Golf feedback for targeted advertising.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Your choices</h2>
            <p className="mt-4">You can choose “Essential only” and use the site without Google Analytics. The small “Privacy choices” control lets you change that selection later. Submitting product feedback is a separate, optional action.</p>
            <p className="mt-4">Practice saving and account sign-in do not require analytics consent. Signing in does not automatically import history from the current browser: use the explicit import button only if those sessions belong to you. Your practice email and recorded shot outcomes are not sent to analytics.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Storage and retention</h2>
            <p className="mt-4">The essential browser storage remembers your privacy choice. Anonymous product feedback is kept for product research and reviewed for deletion after 180 days. Google Analytics information follows the retention settings configured in our Google Analytics property.</p>
            <p className="mt-4"><strong>Browser-only practice history:</strong> While signed out, choosing “Remember my practice” or saving a completed guided session keeps up to 30 completed sessions in this browser. They stay on this device unless you later sign in and explicitly import them. “Delete practice history and turn saving off” removes this browser history and its saving preference. Clearing browser site data also removes them. Anyone using the browser can see its saved history.</p>
            <p className="mt-4"><strong>Account practice history:</strong> After you verify your email and sign in, completed guided sessions save to your account. The account keeps your latest 30 sessions across irons and driver. Older sessions are removed as newer ones are saved. “Delete account practice history” removes those practice records, but leaves your account email and sign-in access in place; future completed sessions can save while you remain signed in. Signing out does not delete account history. Device history and account history are separate: deleting either one does not delete the other. Unfinished attempts and practice videos are not saved in either practice history.</p>
            <p className="mt-4"><strong>Sign-in storage:</strong> The browser stores an authentication session to keep you signed in. Sign out on a shared device when you finish. Clearing browser site data removes that device’s stored sign-in session and browser-only history, but does not delete practice saved to your account. For a request to remove the account itself, contact us using the address below.</p>
            <p className="mt-4">Putting scores remain available for the all-time leaderboard until removed. To limit spam, we store a daily keyed hash derived from the hosting provider’s client IP address, rather than the plain IP. Old rate-limit records and expired unused round tokens are cleaned up during subsequent requests. Downloaded scorecards are created in your browser; sharing them is your choice. For a leaderboard removal request, include the initials, score and submission date.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Service providers</h2>
            <p className="mt-4">Dove Golf currently uses Vercel for hosting, Supabase for account authentication, saved account practice, feedback and leaderboard storage, and Google Analytics only when allowed. These providers process information under their own terms and privacy commitments.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Questions or requests</h2>
            <p className="mt-4">Email <a className="font-medium text-slate-950 underline underline-offset-4" href="mailto:sc4boxer@gmail.com?subject=Dove%20Golf%20Privacy">sc4boxer@gmail.com</a>. Because product feedback is intentionally anonymous, we may not be able to connect a response to you unless you provide its approximate submission time and exact text.</p>
          </section>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          This notice explains the product’s data practices, including optional practice saving and accounts. You can continue using the golf tools without either option.
        </aside>
      </article>
    </main>
  );
}
