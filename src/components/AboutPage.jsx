import { User, MapPin, Brain, Cpu, TrendingUp, Compass, Briefcase } from 'lucide-react';
import './bento.css';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-bento-container">
      <h2 className="sr-only">About Me</h2>
      <div className="about-bento-grid">
        {/* Row 1 */}
        <div className="about-bento-item col-span-2">
          <span className="bento-tag">Profile</span>
          <div className="bento-icon"><User size={14} strokeWidth={2.5} /></div>
          <span className="bento-placeholder">Hello! I am Jatin Davis, a product designer & builder.</span>
        </div>
        <div className="about-bento-item col-span-1">
          <span className="bento-tag">Location</span>
          <div className="bento-icon"><MapPin size={14} strokeWidth={2.5} /></div>
          <span className="bento-placeholder">Bengaluru, India.</span>
        </div>

        {/* Row 2 */}
        <div className="about-bento-item col-span-1">
          <span className="bento-tag">Mindset</span>
          <div className="bento-icon"><Brain size={14} strokeWidth={2.5} /></div>
          <span className="bento-placeholder">Product thinking.</span>
        </div>
        <div className="about-bento-item col-span-1">
          <span className="bento-tag">Interests</span>
          <div className="bento-icon"><Cpu size={14} strokeWidth={2.5} /></div>
          <span className="bento-placeholder">AI coding agents.</span>
        </div>
        <div className="about-bento-item col-span-1">
          <span className="bento-tag">Impact</span>
          <div className="bento-icon"><TrendingUp size={14} strokeWidth={2.5} /></div>
          <span className="bento-placeholder">Product metrics & impact.</span>
        </div>

        {/* Row 3 */}
        <div className="about-bento-item col-span-1">
          <span className="bento-tag">Approach</span>
          <div className="bento-icon"><Compass size={14} strokeWidth={2.5} /></div>
          <span className="bento-placeholder">User centered design.</span>
        </div>
        <div className="about-bento-item col-span-2">
          <span className="bento-tag">Experience</span>
          <div className="bento-icon"><Briefcase size={14} strokeWidth={2.5} /></div>
          <span className="bento-placeholder">Product designer at Double ai, Prev. Maruti Suzuki.</span>
        </div>
      </div>
    </div>
  );
}
