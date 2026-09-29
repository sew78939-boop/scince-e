import { services } from '../data/siteData'

export default function ServicesPage() {
  return (
    <section className="page-shell section-wrap">
      <div className="section-heading">
        <p className="kicker">SERVICES</p>
        <h3>Purpose-built event experiences.</h3>
      </div>

      <div className="three-panel-grid">
        {services.map((service, index) => (
          <article key={service.title} className="page-card page-card--service">
            <span className="card-index">0{index + 1}</span>
            <h4>{service.title}</h4>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
