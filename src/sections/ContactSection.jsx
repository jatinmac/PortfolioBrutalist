import { Section } from '../ds';
import { CONTACT, SECTIONS } from '../data/siteContent';

export default function ContactSection({ onNavigate }) {
  return (
    <Section id="contacts" label="Contacts" tone="contacts">
      <div className="section-heading">
        <h2 className="ds-text--display section-title">{CONTACT.title}</h2>
      </div>

      <address className="contact-list">
        {CONTACT.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="contact-link"
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {link.label}
          </a>
        ))}
      </address>

      <nav className="contact-nav" aria-label="Footer section navigation">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className="contact-nav__button"
            onClick={() => onNavigate(section.navLabel)}
          >
            {section.navLabel}
          </button>
        ))}
      </nav>
    </Section>
  );
}
