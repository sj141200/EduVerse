import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'

function FadeInSection({ children, delay = 0 }) {
  const [isVisible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div
      className={`transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {children}
    </div>
  )
}

function LandingPage() {
  // const { token } = useAuth() || {}

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* HERO */}
      <section className="hero min-h-[60vh] bg-linear-to-br from-primary/10 to-secondary/5">
        <div className="hero-content w-full max-w-6xl mx-auto flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <FadeInSection delay={100}>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Eduverse — Simple online classrooms</h1>
              <p className="py-4 text-base-content/70">Create and manage classes, share announcements and materials, collect assignments, and manage grades — a lightweight classroom management UI for instructors and students.</p>
              <div className="flex gap-3 mt-4">
                <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                <a href="#features" className="btn btn-ghost btn-lg">Explore features</a>
              </div>
            </FadeInSection>
          </div>

          <div className="w-full md:w-1/2">
            <FadeInSection delay={300}>
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="/hero.jpg"
                  alt="classroom overview"
                  className="w-full h-auto object-cover"
                />
              </div>
            </FadeInSection>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInSection delay={150}>
            <h2 className="text-3xl font-bold text-center mb-6">Features</h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeInSection delay={250}>
              <div className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                <div className="card-body">
                  <div className="text-3xl">🏫</div>
                  <h3 className="card-title">Class & course management</h3>
                  <p className="text-base-content/70">Create classes, manage class metadata, and invite students with a join code.</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={350}>
              <div className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                <div className="card-body">
                  <div className="text-3xl">📣</div>
                  <h3 className="card-title">Announcements & materials</h3>
                  <p className="text-base-content/70">Post announcements, upload files, and share resources with your class.</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={450}>
              <div className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                <div className="card-body">
                  <div className="text-3xl">📝</div>
                  <h3 className="card-title">Assignments & grading</h3>
                  <p className="text-base-content/70">Create assignments, collect files, and record grades in the instructor dashboard.</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Trusted by teachers and students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeInSection delay={200}>
              <div className="card bg-base-200 p-6 shadow-md">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/a/80/80" alt="avatar" className="w-14 h-14 rounded-full" />
                  <div>
                    <div className="font-semibold">Priya K.</div>
                    <div className="text-sm text-base-content/60">Math teacher</div>
                  </div>
                </div>
                <p className="mt-4 text-base-content/70">"Eduverse made running quizzes in class effortless. Students loved the instant feedback."</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={300}>
              <div className="card bg-base-200 p-6 shadow-md">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/b/80/80" alt="avatar" className="w-14 h-14 rounded-full" />
                  <div>
                    <div className="font-semibold">Carlos M.</div>
                    <div className="text-sm text-base-content/60">Student</div>
                  </div>
                </div>
                <p className="mt-4 text-base-content/70">"The live leaderboards make quizzes fun and engaging. I actually study more now."</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className="card bg-base-200 p-6 shadow-md">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/c/80/80" alt="avatar" className="w-14 h-14 rounded-full" />
                  <div>
                    <div className="font-semibold">Aisha R.</div>
                    <div className="text-sm text-base-content/60">Curriculum designer</div>
                  </div>
                </div>
                <p className="mt-4 text-base-content/70">"Easy reporting and exports saved us hours every week."</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeInSection delay={200}>
            <h3 className="text-2xl font-bold">Ready to bring your classroom online?</h3>
            <p className="text-base-content/70 mt-2">Start a free classroom in minutes. No credit card required.</p>
            <div className="mt-6 flex justify-center gap-4">
              <Link to={"/register"} className="btn btn-primary btn-lg">Start free</Link>
              <a href="#features" className="btn btn-ghost">See features</a>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
