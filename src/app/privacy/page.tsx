import type { Metadata } from "next";
import { HomeLinkPill } from "@/components/HomeLinkPill";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Dove Golf handles optional analytics and anonymous product feedback.",
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
            We want to learn whether the tools are useful without building a profile about you.
            Participation in analytics and product feedback is optional.
          </p>
          <p className="mt-4 text-sm text-slate-500">Last updated September 1, 2026</p>
        </header>

        <div className="space-y-10 py-10 text-base leading-7 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">What we collect</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li><strong>Optional analytics:</strong> If you allow analytics, Google Analytics may collect page views, session activity, approximate location, and broad browser or device information.</li>
              <li><strong>Optional product feedback:</strong> The module used, selected miss, whether the guidance helped, an optional golf-experience range, what topic you want next, and an optional comment.</li>
              <li><strong>Basic technical processing:</strong> Our hosting and security providers may temporarily process request information such as IP address and user agent to deliver and protect the site. Dove Golf does not add those fields to the product-feedback table.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">What anonymous feedback does not request</h2>
            <p className="mt-4">The feedback form does not ask for your name, email, exact age, precise location, account, swing video, or persistent visitor identifier. Please do not put personal information in the optional comment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Why we use it</h2>
            <p className="mt-4">We use the information to understand whether a module was clear, find confusing steps, prioritize future modules, measure basic site performance, and protect the service from misuse. We do not sell personal information or use Dove Golf feedback for targeted advertising.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Your choices</h2>
            <p className="mt-4">You can choose “Essential only” and use the site without Google Analytics. The small “Privacy choices” control lets you change that selection later. Submitting product feedback is a separate, optional action.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Storage and retention</h2>
            <p className="mt-4">The essential browser storage remembers only your privacy choice. Anonymous product feedback is kept for product research and reviewed for deletion after 180 days. Google Analytics information follows the retention settings configured in our Google Analytics property.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Service providers</h2>
            <p className="mt-4">Dove Golf currently uses Vercel for hosting, Supabase for feedback storage, and Google Analytics only when allowed. These providers process information under their own terms and privacy commitments.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Questions or requests</h2>
            <p className="mt-4">Email <a className="font-medium text-slate-950 underline underline-offset-4" href="mailto:sc4boxer@gmail.com?subject=Dove%20Golf%20Privacy">sc4boxer@gmail.com</a>. Because product feedback is intentionally anonymous, we may not be able to connect a response to you unless you provide its approximate submission time and exact text.</p>
          </section>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          This notice explains the product’s current data practices. Privacy requirements depend on where a business and its visitors are located; obtain qualified legal advice as Dove Golf grows or adds advertising, payments, accounts, or more detailed profiling.
        </aside>
      </article>
    </main>
  );
}
