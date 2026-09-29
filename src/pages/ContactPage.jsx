import { contactInfo } from '../data/siteData'

export default function ContactPage() {
  return (
    <section className="page-shell section-wrap">
      <div className="section-heading">
        <p className="kicker">CONTACT</p>
        <h3>Start your next event conversation.</h3>
      </div>

      <div className="contact-grid">
        {contactInfo.map((item) => (
          <article key={item.label} className="page-card page-card--contact">
            <span>{item.label}</span>
            <p>{item.value}</p>
          </article>
        ))}
      </div>

      <div className="cta-box">
        <h4>Let’s design the event experience you want people to remember.</h4>
        <a href="mailto:hello@science-event.com" className="button button-primary">MAKE ENQUIRY</a>
      </div>
    </section>
  )
}
