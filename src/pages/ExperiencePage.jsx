import { experienceSteps, digitalFocus } from '../data/siteData'

export default function ExperiencePage() {
  return (
    <section className="page-shell section-wrap">
      <div className="section-heading">
        <p className="kicker">SCIENCE EXPERIENCE</p>
        <h3>Every touchpoint is designed to create memory.</h3>
      </div>

      <div className="journey-grid">
        {experienceSteps.map((step) => (
          <article key={step} className="journey-step">
            <span>{step}</span>
          </article>
        ))}
      </div>

      <div className="page-grid page-grid--two">
        <article className="page-panel page-panel--feature">
          <p className="mini-label">EXPERIENCE DESIGN</p>
          <h4>We shape every movement inside the event.</h4>
        </article>

        <article className="page-panel">
          <p className="mini-label">DIGITAL FOCUS</p>
          <ul className="list-inline">
            {digitalFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
