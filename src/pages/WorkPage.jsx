import { projectPillars } from '../data/siteData'

export default function WorkPage() {
  return (
    <section className="page-shell section-wrap">
      <div className="section-heading">
        <p className="kicker">OUR WORK</p>
        <h3>Selected project environments.</h3>
      </div>

      <div className="project-grid page-grid--three">
        {projectPillars.map((project) => (
          <article key={project.name} className="project-card project-card--page">
            <div className="project-media" aria-hidden="true">
              <div className="project-visual" />
            </div>
            <div className="project-copy">
              <span className="status-tag">{project.status}</span>
              <h4>{project.name}</h4>
              <p>{project.label}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
