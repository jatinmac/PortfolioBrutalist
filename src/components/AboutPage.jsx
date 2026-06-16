import { VisuallyHidden, Text } from '../ds';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-deck-wrapper">
      <VisuallyHidden as="h2">About Me</VisuallyHidden>

      {/* Left Outer Card */}
      <div className="about-side-card left-outer">
        <div
          className="side-card-image"
          style={{ backgroundImage: 'url("/about/f1 2004.jpg")' }}
        />
        <div className="side-card-bottom">
          <span className="side-card-heading">F1 Fan</span>
        </div>
      </div>

      {/* Left Inner Card */}
      <div className="about-side-card left-inner">
        <div
          className="side-card-image"
          style={{ backgroundImage: 'url("/about/f40.jpg")' }}
        />
        <div className="side-card-bottom">
          <span className="side-card-heading">Car Enthusiast</span>
        </div>
      </div>

      {/* Center Main Card */}
      <div className="about-hero-container">
        <div className="about-hero-text">
          <Text variant="overline" className="about-overheading">About Me</Text>
          <Text
            variant="display"
            as="h1"
            className="about-heading"
          >
            Designing & building products.
          </Text>
          <Text
            variant="body-sm"
            as="p"
            className="about-subheading"
          >
            Hello! I am Jatin Davis, a product designer & builder based in Bengaluru, India.
            <br /><br />
            Currently a Product Designer at Cardtree AI (previously Maruti Suzuki),
            <br /><br />
            I combine user-centered design and product thinking with modern tools like AI coding agents to drive product metrics & impact.

          </Text>
        </div>
      </div>

      {/* Right Inner Card */}
      <div className="about-side-card right-inner">
        <div
          className="side-card-image"
          style={{ backgroundImage: 'url("/about/running.avif")' }}
        />
        <div className="side-card-bottom">
          <span className="side-card-heading">Runner</span>
        </div>
      </div>

      {/* Right Outer Card */}
      <div className="about-side-card right-outer">
        <div
          className="side-card-image"
          style={{ backgroundImage: 'url("/about/boston.jpg")' }}
        />
        <div className="side-card-bottom">
          <span className="side-card-heading">80s Music Fan</span>
        </div>
      </div>
    </div>
  );
}
