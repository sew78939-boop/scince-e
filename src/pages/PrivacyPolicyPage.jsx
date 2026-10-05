import { useLanguage } from '../i18n'

const policySections = [
  {
    title: 'Information We Collect',
    paragraphs: [
      'When you contact SCIENCE through our website, we may collect information such as:',
    ],
    items: [
      'Full name',
      'Company or organization name',
      'Email address',
      'Phone number',
      'Event or project details',
      'Services you are interested in',
      'Preferred event date',
      'Any additional information you choose to provide in your message',
      'Files or documents you voluntarily submit through our website',
    ],
    closing: 'We only request information that is relevant to responding to your inquiry or providing the requested service.',
  },
  {
    title: 'How We Use Your Information',
    paragraphs: ['We may use the information you provide to:'],
    items: [
      'Respond to your inquiries and requests.',
      'Contact you regarding your project or event.',
      'Understand your requirements and prepare an appropriate response or proposal.',
      'Communicate with you about services you have requested.',
      'Improve our website and communication experience.',
      'Maintain records related to inquiries and business communications.',
    ],
    closing: 'We will not use your information for unrelated purposes without an appropriate legal basis or your consent where required.',
  },
  {
    title: 'How We Share Your Information',
    paragraphs: [
      'SCIENCE does not sell or rent your personal information.',
      'We may share information only when necessary to operate our services, respond to your request, comply with applicable legal requirements, or protect our rights and security.',
      'Where third-party service providers are used to support our website or communications, they may process information only as necessary to provide those services.',
    ],
  },
  {
    title: 'Data Security',
    paragraphs: [
      'We take reasonable technical and organizational measures to protect the information submitted through our website against unauthorized access, alteration, disclosure, or loss.',
      'However, no method of transmitting or storing information online can be guaranteed to be completely secure.',
    ],
  },
  {
    title: 'Data Retention',
    paragraphs: [
      'We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including responding to inquiries, managing business communications, fulfilling contractual or legal obligations, and resolving disputes.',
      'The appropriate retention period may vary depending on the nature of the information and the purpose for which it was collected.',
    ],
  },
  {
    title: 'Cookies and Website Technologies',
    paragraphs: [
      'Our website may use cookies or similar technologies to support website functionality, understand website usage, and improve the user experience.',
      'Where required, we will request the appropriate consent before using non-essential cookies or similar technologies.',
    ],
  },
  {
    title: 'Third-Party Links',
    paragraphs: [
      'Our website may contain links to third-party websites or social media platforms.',
      'SCIENCE is not responsible for the privacy practices or content of third-party websites. We recommend reviewing the privacy policies of those websites before providing them with personal information.',
    ],
  },
  {
    title: 'Your Choices',
    paragraphs: [
      'You may choose not to provide certain information. However, this may prevent us from responding fully to your inquiry or providing certain services.',
      'If you have submitted information to us and would like to request access, correction, or deletion of your personal information, you may contact us using the contact details provided on our website.',
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      'Our website is not intended to knowingly collect personal information from children.',
      'If you believe that a child has provided personal information through our website, please contact us so that we can take appropriate action.',
    ],
  },
  {
    title: 'Changes to This Privacy Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes to our services, website, or applicable requirements.',
      'When we make changes, the updated version will be published on this page together with the revised “Last Updated” date.',
    ],
  },
  {
    title: 'Contact Us',
    paragraphs: [
      'If you have questions about this Privacy Policy or how your information is handled, please contact SCIENCE Event Management through the contact information provided on our website.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  return (
    <section className="page-shell section-wrap">
      <div className="section-heading">
        <p className="kicker">{t('PRIVACY')}</p>
        <h3>{t('Privacy Policy')}</h3>
        <p className="privacy-last-updated">
          <strong>{t('Last Updated')}:</strong> {t('October 5, 2026')}
        </p>
      </div>

      <div className="privacy-intro page-panel page-panel--feature">
        <p>{t('SCIENCE Event Management (“SCIENCE”, “we”, “our”, or “us”) respects your privacy and is committed to protecting the personal information you provide when you use our website or contact us through our online forms.')}</p>
        <p>{t('This Privacy Policy explains what information we may collect, how we use it, and how we protect it.')}</p>
      </div>

      <div className="privacy-sections">
        {policySections.map(({ title, paragraphs, items, closing }, index) => (
          <article className="page-panel privacy-section" key={title}>
            <span className="mini-label">{String(index + 1).padStart(2, '0')}</span>
            <h4>{t(title)}</h4>
            {paragraphs.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
            {items && (
              <ul>
                {items.map((item) => <li key={item}>{t(item)}</li>)}
              </ul>
            )}
            {closing && <p>{t(closing)}</p>}
            {title === 'Contact Us' && (
              <p><a href="mailto:science@elmawy.com">science@elmawy.com</a></p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
