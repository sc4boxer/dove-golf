import type { ReactNode } from "react";
import Link from "next/link";
import { TrackLink } from "@/components/analytics/TrackLink";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600";

export function PracticeGuide({ title, description, path, club, children }: {
  title: string;
  description: string;
  path: string;
  club: "iron" | "driver";
  children: ReactNode;
}) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dove Golf", item: "https://dovegolf.fit/" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://dovegolf.fit/learn" },
      { "@type": "ListItem", position: 3, name: title, item: `https://dovegolf.fit${path}` },
    ],
  };
  return <main className="min-h-screen bg-white text-slate-900">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
    <article className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Link href="/" className={`rounded hover:text-slate-900 ${focus}`}>Dove Golf</Link>
        <span aria-hidden="true">/</span>
        <Link href="/learn" className={`rounded hover:text-slate-900 ${focus}`}>Learn</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{club === "driver" ? "Driver practice" : "Beginner range practice"}</span>
      </nav>
      <header className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Beginner practice · By Dove Golf</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
      </header>
      <div className="mt-8 rounded-3xl border border-sky-100 bg-sky-50 p-6 sm:p-8">
        <p className="text-sm font-semibold text-slate-900">Your practice at a glance</p>
        <ol className="mt-4 grid gap-4 text-sm leading-6 sm:grid-cols-3">
          <li><strong className="block text-sky-800">1. Observe five shots</strong>Use one club and record every attempt.</li>
          <li><strong className="block text-sky-800">2. Try one change</strong>Rehearse a smaller, comfortable swing.</li>
          <li><strong className="block text-sky-800">3. Compare five shots</strong>Count contact and height before distance.</li>
        </ol>
      </div>
      <div className="mt-12 space-y-10">{children}</div>
      <section className="mt-12 rounded-3xl bg-slate-900 p-7 text-white sm:p-8" aria-labelledby="guided-practice">
        <h2 id="guided-practice" className="text-2xl font-semibold tracking-tight">Take the guide to the range.</h2>
        <p className="mt-3 leading-7 text-slate-300">
          Range Rescue includes an animated practice guide, a five-shot recorder, and a comparison of your two sets.
          {club === "driver" ? " Choose Driver, then “Start guided driver practice.”" : " Keep Irons selected, then choose “Start guided beginner practice.”"}
          {" "}No account is needed. Session results clear when you leave or refresh the page.
        </p>
        <TrackLink href="/range-rescue" eventParams={{ module: "range_rescue", placement: "learn_practice_guide", club, version: "v1" }}
          className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-sky-50 ${focus}`}>
          Open Range Rescue <span className="ml-2" aria-hidden="true">→</span>
        </TrackLink>
      </section>
      <footer className="mt-10 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-600">
        <p>This is Dove Golf’s contact practice plan, based on the steps in our guided tool. For broader practice habits, including choosing a session focus and a repeatable routine, see{" "}
          <a href="https://www.pga.com/story/four-must-dos-every-time-you-practice-on-a-golf-driving-range" className={`rounded underline underline-offset-4 ${focus}`}>PGA of America’s range practice advice</a>.
        </p>
      </footer>
    </article>
  </main>;
}

export function GuideSection({ title, children }: { title: string; children: ReactNode }) {
  return <section>
    <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    <div className="mt-4 space-y-4 leading-7 text-slate-600">{children}</div>
  </section>;
}

export function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  return <TrackLink href={href} eventParams={{ module: "learn", placement: "learn_related_guide", version: "v1" }} className={`rounded font-medium text-sky-800 underline underline-offset-4 ${focus}`}>{children}</TrackLink>;
}
