import { ArrowRight, BriefcaseBusiness, Building2, Flame, GraduationCap, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeSwitcher from '../components/common/ThemeSwitcher'

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Flame className="text-saffron-500" />
          <span className="font-display text-xl">GapBurn</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link to="/login" className="rounded-xl px-4 py-2 text-sm text-brand-100 hover:bg-white/5">
            Log in
          </Link>
          <Link to="/register" className="rounded-xl bg-saffron-600 px-4 py-2 text-sm font-semibold text-white">
            Create account
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-300">
          SIH26044 · Ministry of Ayush · All India Institute of Ayurveda
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
          A Career Digital Twin that actually closes the skill gap.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-brand-100/80">
          Evidence in. Skill DNA out. Students, faculty, institutions, and industry share one explainable map from
          classroom proof to internship and placement.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-brand-950"
        >
          Open the demo <ArrowRight size={16} />
        </Link>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-4">
          {[
            ['01', 'Evidence', 'Resumes, certificates, projects, and assessments become Skill DNA.'],
            ['02', 'Gap', 'Target roles from industry show what is missing — and why.'],
            ['03', 'Path', 'Learning items and AI industry projects close the gap with faculty checks.'],
            ['04', 'Match', 'Internships and jobs rank candidates with an explainable score.'],
          ].map(([n, t, d]) => (
            <article key={n} className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-saffron-600">{n}</p>
              <h2 className="mt-2 font-display text-2xl">{t}</h2>
              <p className="mt-2 text-sm text-stone-600">{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 text-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-700">The project</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-brand-950 md:text-5xl">
              One shared language for classroom evidence and real hiring needs.
            </h2>
          </div>
          <div className="grid gap-5 text-stone-700">
            <p className="text-lg leading-8">
              GapBurn is a role-based career intelligence platform designed for the Ayurveda and healthcare ecosystem. It converts scattered proof such as certificates, projects, assessments, internships, and faculty reviews into a living Career Digital Twin.
            </p>
            <p className="leading-7">
              Instead of treating employability as a single score, the platform shows which skills a learner can prove, where evidence is weak, what industry expects, and which learning activity can close the next gap. Every recommendation remains explainable to the student, faculty mentor, institution, and hiring partner.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-saffron-700">Four connected perspectives</p>
            <h2 className="mt-3 font-display text-4xl text-brand-950">Each account moves the same learner journey forward.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [GraduationCap, 'Students', 'Build a verified portfolio, track skill gaps, add achievements, follow a learning path, and apply to relevant opportunities.'],
              [Users, 'Faculty', 'Mentor students, verify evidence, manage student accounts, and turn observed progress into trusted signals.'],
              [Building2, 'Institutions', 'See supply versus demand, review placement outcomes, identify shortages, and plan curriculum or intervention priorities.'],
              [BriefcaseBusiness, 'Industry', 'Define role requirements, publish internships and assignments, review applicants, and communicate the skills that matter.'],
            ].map(([Icon, title, description]) => (
              <article key={title} className="border-t-2 border-brand-200 pt-5">
                <Icon className="text-brand-700" size={24} />
                <h3 className="mt-4 font-display text-2xl text-brand-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-saffron-300">What the platform delivers</p>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">From raw evidence to a next action.</h2>
            <p className="mt-5 max-w-xl leading-7 text-brand-100/80">
              GapBurn creates a continuous loop: collect evidence, understand the gap, practise the right skill, verify the result, and match the learner to an opportunity where that evidence has value.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Explainable matching', 'Candidates see why a role fits and what would improve their score.'],
              ['Evidence confidence', 'Faculty and industry verification make skill claims more trustworthy.'],
              ['Actionable analytics', 'Institutions can move from placement numbers to intervention plans.'],
              ['Opportunity alignment', 'Jobs, internships, and assignments reflect current industry demand.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-100/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Explore the working demo</p>
            <h2 className="mt-2 font-display text-3xl text-brand-950">See the same skill story from every side.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">Sign in as a student, faculty member, institution, industry partner, or administrator to explore the connected workflows.</p>
          </div>
          <Link to="/login" className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800">
            Explore the demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
