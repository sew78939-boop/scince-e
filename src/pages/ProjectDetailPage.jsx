import { Link, Navigate, useParams } from 'react-router'
import { projectPillars } from '../data/siteData'
import { useLanguage } from '../i18n'

export default function ProjectDetailPage() {
  const { t } = useLanguage()
  const { projectSlug } = useParams()
  const currentIndex = projectPillars.findIndex((project) => project.slug === projectSlug)

  if (currentIndex === -1) {
    return <Navigate to="/our-work" replace />
  }

  const project = projectPillars[currentIndex]
  const previousProject = projectPillars[currentIndex - 1]
  const nextProject = projectPillars[currentIndex + 1]

  return (
    <section className="page-shell section-wrap">
      <Link className="detail-back" to="/our-work">
        {t('Back to all projects')}
      </Link>

      <div className="section-heading">
        <p className="kicker">{t('PROJECT /')} {t(project.status)}</p>
        <h3>{t(project.name)}</h3>
      </div>

      <div className="project-detail-media">
        <div
          className="project-visual"
          role="img"
          aria-label={`${t('Project image')}: ${t(project.name)}`}
          style={{ backgroundImage: `linear-gradient(180deg, rgba(10, 15, 22, 0.1), rgba(7,11,18,0.38)), url(${project.image})` }}
        />
      </div>

      <div className="detail-grid project-detail-info">
        <article className="page-panel page-panel--feature">
          <p className="mini-label">{t('PROJECT TYPE')}</p>
          <h4>{t(project.label)}</h4>
        </article>
        <aside className="page-panel">
          <p className="mini-label">{t('STATUS')}</p>
          <p className="detail-copy">{t(project.status)}</p>
        </aside>
      </div>

      <nav className="detail-navigation" aria-label={t('Project navigation')}>
        <Link to={previousProject ? `/our-work/${previousProject.slug}` : '/our-work'}>
          <span>{t(previousProject ? 'Previous project' : 'Project overview')}</span>
          <strong>{t(previousProject ? previousProject.name : 'All projects')}</strong>
        </Link>
        <Link to={nextProject ? `/our-work/${nextProject.slug}` : '/our-work'}>
          <span>{t(nextProject ? 'Next project' : 'Project overview')}</span>
          <strong>{t(nextProject ? nextProject.name : 'All projects')}</strong>
        </Link>
      </nav>
    </section>
  )
}