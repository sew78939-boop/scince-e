import { gallery } from '../data/siteData'

export default function CaseStudiesPage() {
  return (
    <section className="page-shell section-wrap">
      <div className="section-heading">
        <p className="kicker">CASE STUDIES</p>
        <h3>Scientific content, confident delivery, and public impact.</h3>
      </div>

      <div className="page-grid page-grid--two">
        <article className="page-panel page-panel--feature">
          <p className="mini-label">PROJECT FOCUS</p>
          <h4>Scientific events designed to feel premium, clear, and human.</h4>
        </article>

        <article className="page-panel">
          <p className="mini-label">DELIVERY</p>
          <p>From pre-production planning to guest experience design, each project is built around mission clarity.</p>
        </article>
      </div>

      <div className="three-panel-grid">
        {gallery.map((item) => (
          <article key={item} className="page-card">
            <span>{item}</span>
            <p>Experience layer designed for clarity, identity, and audience engagement.</p>
          </article>
        ))}
      </div>
    </section>
  )
}
