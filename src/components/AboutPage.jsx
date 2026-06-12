import { User, MapPin, Brain, Cpu, TrendingUp, Compass, Briefcase } from 'lucide-react';
import { VisuallyHidden, BentoGrid, BentoItem } from '../ds';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-bento-container">
      <VisuallyHidden as="h2">About Me</VisuallyHidden>
      <BentoGrid columns="repeat(3, 1fr)" className="about-bento-grid">
        {/* Row 1 */}
        <BentoItem colSpan={2} tag="Profile" icon={User}>
          Hello! I am Jatin Davis, a product designer & builder.
        </BentoItem>
        <BentoItem colSpan={1} tag="Location" icon={MapPin}>
          Bengaluru, India.
        </BentoItem>

        {/* Row 2 */}
        <BentoItem colSpan={1} tag="Mindset" icon={Brain}>
          Product thinking.
        </BentoItem>
        <BentoItem colSpan={1} tag="Tool" icon={Cpu}>
          AI coding agents.
        </BentoItem>
        <BentoItem colSpan={1} tag="Goal" icon={TrendingUp}>
          Product metrics & impact.
        </BentoItem>

        {/* Row 3 */}
        <BentoItem colSpan={1} tag="Approach" icon={Compass}>
          User-centered design.
        </BentoItem>
        <BentoItem colSpan={2} tag="Experience" icon={Briefcase}>
          Product designer at Double AI, previously at Maruti Suzuki and Colliers International.
        </BentoItem>
      </BentoGrid>
    </div>
  );
}
