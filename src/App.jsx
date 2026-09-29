import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import { navItems } from './data/siteData'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import WorkPage from './pages/WorkPage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import ExperiencePage from './pages/ExperiencePage'
import TeamPage from './pages/TeamPage'
import ContactPage from './pages/ContactPage'

function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-lockup">
          <span className="brand-mark">SCIENCE</span>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/our-work" element={<WorkPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/science-experience" element={<ExperiencePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div>
          <p className="footer-brand">SCIENCE EVENT MANAGEMENT</p>
        </div>

        <div className="footer-links" aria-label="Footer navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <p className="copyright">© 2026 SCIENCE EVENT MANAGEMENT</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
