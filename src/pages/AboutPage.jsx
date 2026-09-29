import { services } from '../data/siteData'

export default function AboutPage() {
  return (
    <section className="page-shell section-wrap">
      <div className="section-heading">
        <p className="kicker">ABOUT</p>
        <h3>SCIENCE EVENT MANAGEMENT.</h3>
      </div>

      <div className="page-grid page-grid--two">
        <article className="page-panel page-panel--feature">
          <p className="mini-label">INTRO</p>
          <h4>We create meaningful, high-impact experiences.</h4>
        </article>

        <article className="page-panel">
          <p className="mini-label">VISION</p>
          <p>To shape elegant, memorable, and operationally precise experiences for science-led audiences.</p>
        </article>

        <article className="page-panel">
          <p className="mini-label">MISSION</p>
          <p>To connect strategy, production, and design into a clear and compelling event journey.</p>
        </article>

        <article className="page-panel">
          <p className="mini-label">WHY SCIENCE</p>
          <p>Because the most persuasive experiences are rooted in purpose, clarity, and careful execution.</p>
        </article>
      </div>

      <div className="three-panel-grid panel-row">
        {services.map((service) => (
          <article key={service.title} className="page-card">
            <span>{service.title}</span>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
