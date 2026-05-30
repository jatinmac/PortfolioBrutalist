import { useState } from 'react';
import { Copy, Check, ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import './bento.css';
import './ContactPage.css';

export default function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      playClickSound();
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else if (type === 'phone') {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    });
  };

  return (
    <div className="contact-bento-container">
      <h2 className="sr-only">Contact Information</h2>
      <div className="contact-bento-grid">
        {/* Row 1 */}
        <div className="contact-bento-item col-span-2">
          <span className="bento-tag">Email</span>
          <button
            className="corner-link-btn"
            onClick={() => copyToClipboard('jatin.davis@gmail.com', 'email')}
            aria-label="Copy email address"
          >
            {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <span className="bento-placeholder">jatindavis5@gmail.com</span>
        </div>
        <div className="contact-bento-item col-span-1">
          <span className="bento-tag">Social</span>
          <a
            href="https://linkedin.com/in/jatindavis"
            target="_blank"
            rel="noopener noreferrer"
            className="corner-link-btn linkedin-btn"
            aria-label="Visit LinkedIn Profile"
            onClick={() => playClickSound()}
          >
            <ArrowUpRight size={14} />
          </a>
          <span className="bento-placeholder">LinkedIn</span>
        </div>

        {/* Row 2 */}
        <div className="contact-bento-item col-span-2">
          <span className="bento-tag">Phone</span>
          <button
            className="corner-link-btn"
            onClick={() => copyToClipboard('+91 99999 99999', 'phone')}
            aria-label="Copy phone number"
          >
            {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <span className="bento-placeholder">+91 8920152733</span>
        </div>
        <div className="contact-bento-item col-span-1">
          <span className="bento-tag">Social</span>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="corner-link-btn youtube-btn"
            aria-label="Visit YouTube Channel"
            onClick={() => playClickSound()}
          >
            <ArrowUpRight size={14} />
          </a>
          <span className="bento-placeholder">YouTube</span>
        </div>
      </div>
    </div>
  );
}
