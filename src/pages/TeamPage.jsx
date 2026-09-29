import { teamItems } from '../data/siteData'

export default function TeamPage() {
  return (
    <section className="page-shell section-wrap">
      <div className="section-heading">
        <p className="kicker">TEAM</p>
        <h3>A multidisciplinary team behind every experience.</h3>
      </div>

      <div className="three-panel-grid">
        {teamItems.map((item) => (
          <article key={item} className="page-card">
            <span>{item}</span>
            <p>Shared expertise in design, execution, and audience engagement.</p>
          </article>
        ))}
      </div>
    </section>
  )
}
