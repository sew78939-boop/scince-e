import { useState } from 'react'
import { Link } from 'react-router'
import { contactInfo } from '../data/siteData'
import { useLanguage } from '../i18n'

const formspreeFormId = import.meta.env.VITE_FORMSPREE_FORM_ID?.trim()
const inquiryServices = [
  'Event Management',
  'Scientific Conference',
  'Scientific Day',
  'Branding & Visual Identity',
  'Production & Setup',
  'Registration & QR Solutions',
  'Media Coverage',
  'Other',
]

export default function ContactPage() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState('')

  const handleInquirySubmit = async (event) => {
    event.preventDefault()

    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name')
    const email = formData.get('email')
    const recipient = contactInfo.find((item) => item.label === 'Email').value

    if (formspreeFormId && formData.get('_gotcha')) return

    if (!formspreeFormId) {
      const message = [
        `${t('Full Name')}: ${name}`,
        `${t('Company / Organization')}: ${formData.get('company') || t('Not specified')}`,
        `${t('Email Address')}: ${email}`,
        `${t('Phone Number')}: ${formData.get('phone')}`,
        `${t('Service Required')}: ${t(formData.get('service'))}`,
        `${t('Preferred Event Date')}: ${formData.get('event_date') || t('Not specified')}`,
        '',
        `${t('Tell us about your project')}:`,
        formData.get('message'),
        '',
        `${t('Contact consent')}: ${t('Agreed')}`,
      ].join('\n')
      const subject = encodeURIComponent(`${t('Event enquiry')} - ${name}`)
      setSubmissionMessage(t('Your email app will open. Send the prepared message to complete your inquiry.'))
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(message)}`
      return
    }

    formData.set('_subject', `Event enquiry - ${name}`)
    formData.set('_replyto', email)
    setIsSubmitting(true)
    setSubmissionMessage('')

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeFormId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      if (!response.ok) {
        setSubmissionMessage(t('We could not send your inquiry. Please try again or contact us by email.'))
        return
      }

      form.reset()
      setSubmissionMessage(t('Your inquiry was sent successfully. We will be in touch soon.'))
    } catch {
      setSubmissionMessage(t('We could not send your inquiry. Please try again or contact us by email.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-shell section-wrap">
      <div className="contact-grid">
        {contactInfo.map((item) => (
          <a
            key={item.label}
            className="page-card page-card--contact"
            href={item.href}
            target={item.href.startsWith('https://') ? '_blank' : undefined}
            rel={item.href.startsWith('https://') ? 'noreferrer' : undefined}
          >
            <span>{t(item.label)}</span>
            <p>{item.value}</p>
          </a>
        ))}
      </div>

      <form className="inquiry-form" onSubmit={handleInquirySubmit}>
        <div className="form-header">
          <span>{t('GET IN TOUCH')}</span>
          <h2>{t("Let's Work Together")}</h2>
          <p>{t('Tell us about your project and our team will get back to you.')}</p>
        </div>

        <div className="form-honeypot" aria-hidden="true">
          <label>
            Leave this field empty
            <input name="_gotcha" tabIndex="-1" autoComplete="off" />
          </label>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="inquiry-name">{t('Full Name')} *</label>
            <input
              type="text"
              id="inquiry-name"
              name="name"
              placeholder={t('Your full name')}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inquiry-company">{t('Company / Organization')}</label>
            <input
              type="text"
              id="inquiry-company"
              name="company"
              placeholder={t('Company name')}
              autoComplete="organization"
            />
          </div>

          <div className="form-group">
            <label htmlFor="inquiry-email">{t('Email Address')} *</label>
            <input
              type="email"
              id="inquiry-email"
              name="email"
              placeholder={t('your@email.com')}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inquiry-phone">{t('Phone Number')} *</label>
            <input
              type="tel"
              id="inquiry-phone"
              name="phone"
              placeholder="+20"
              autoComplete="tel"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inquiry-service">{t('Service Required')} *</label>
            <select id="inquiry-service" name="service" defaultValue="" required>
              <option value="" disabled>{t('Select a service')}</option>
              {inquiryServices.map((service) => (
                <option key={service} value={service}>{t(service)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="inquiry-event-date">{t('Preferred Event Date')}</label>
            <input type="date" id="inquiry-event-date" name="event_date" />
          </div>

          <div className="form-group full-width">
            <label htmlFor="inquiry-message">{t('Tell us about your project')} *</label>
            <textarea
              id="inquiry-message"
              name="message"
              rows="6"
              placeholder={t('Tell us about your event, requirements, expected audience, location, or any other details...')}
              required
            />
          </div>
        </div>

        <div className="form-footer">
          <div className="consent">
            <input id="contact-consent" type="checkbox" name="contactConsent" value="Agreed" required />
            <label htmlFor="contact-consent">
              {t('I agree to be contacted regarding my inquiry. I have read and acknowledge the')}
              {' '}
              <Link to="/privacy-policy">{t('Privacy Policy')}</Link>.
            </label>
          </div>

          {submissionMessage && (
            <p className="form-field-full" role="status" aria-live="polite">
              {submissionMessage}
            </p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {t(isSubmitting ? 'SENDING INQUIRY' : formspreeFormId ? 'SEND INQUIRY' : 'Send Inquiry')}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </section>
  )
}
