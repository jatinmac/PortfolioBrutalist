import { useState } from 'react';
import { Copy, Check, ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { VisuallyHidden, BentoGrid, BentoItem, IconButton, Icon } from '../ds';
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
      <VisuallyHidden as="h2">Contact Information</VisuallyHidden>
      <BentoGrid columns="repeat(3, 1fr)" className="contact-bento-grid">
        {/* Row 1 */}
        <BentoItem colSpan={2} tag="Email">
          <IconButton
            size="sm"
            round
            placement="corner"
            onClick={() => copyToClipboard('jatindavis5@gmail.com', 'email')}
            aria-label="Copy email address"
          >
            <Icon icon={copiedEmail ? Check : Copy} size="sm" />
          </IconButton>
          jatindavis5@gmail.com
        </BentoItem>

        <BentoItem colSpan={1} tag="Social">
          <IconButton
            as="a"
            href="https://linkedin.com/in/jatindavis"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            round
            placement="corner"
            aria-label="Visit LinkedIn Profile"
            onClick={() => playClickSound()}
          >
            <Icon icon={ArrowUpRight} size="sm" />
          </IconButton>
          LinkedIn
        </BentoItem>

        {/* Row 2 */}
        <BentoItem colSpan={2} tag="Phone">
          <IconButton
            size="sm"
            round
            placement="corner"
            onClick={() => copyToClipboard('+91 8920152733', 'phone')}
            aria-label="Copy phone number"
          >
            <Icon icon={copiedPhone ? Check : Copy} size="sm" />
          </IconButton>
          +91 8920152733
        </BentoItem>

        <BentoItem colSpan={1} tag="Social">
          <IconButton
            as="a"
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            round
            placement="corner"
            aria-label="Visit YouTube Channel"
            onClick={() => playClickSound()}
          >
            <Icon icon={ArrowUpRight} size="sm" />
          </IconButton>
          YouTube
        </BentoItem>
      </BentoGrid>
    </div>
  );
}
