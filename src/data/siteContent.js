import doubleAiImg from '../images/Double AI.png';
import formula1Img from '../images/Formula 1 Youtube.png';
import marutiSuzukiImg from '../images/Maruti Suzuki.png';
import quiloAiImg from '../images/Quilo AI.png';
import u3kImg from '../images/U3K.png';
import aiTwinImg from '../images/builds/AITWIN.png';
import aiWebsiteImg from '../images/builds/AIWebsite.png';
import aiUiImg from '../images/builds/AIUIdesignSystem.png';
import skillsMdImg from '../images/builds/SKILLSMD.png';


export const SECTIONS = [
  { id: 'home', navLabel: 'HOME', label: 'Home' },
  { id: 'about', navLabel: 'ABOUT', label: 'About' },
  { id: 'work', navLabel: 'WORK', label: 'Work' },
  { id: 'builds', navLabel: 'BUILDS', label: 'Builds' },
  { id: 'contacts', navLabel: 'CONTACTS', label: 'Contacts' },
];

export const HERO = {
  title: 'Product designer & builder shipping experiences that create impact.',
  summary:
    'Product designer working on AI twin agent experience @Cardtree AI. Prev. product designer at Maruti Suzuki.',
  actions: [
    { label: 'Work', target: 'WORK', variant: 'accent' },
    { label: 'Builds', target: 'BUILDS', variant: 'secondary' },
  ],
};

export const ABOUT = {
  title: 'About',
  body:
    'I believe that interfaces should feel responsive, structural, and tactile. By combining engineering principles with retro brutalist typography, I build products that stand out.',
  visualLabels: ['Systems', 'Motion', 'Automotive', 'AI UX', 'Tools'],
};

export const PROJECT_GROUPS = {
  work: {
    id: 'work',
    title: 'Work',
    tone: 'work',
    projects: [
      {
        eyebrow: '01',
        title: 'Double AI',
        description: 'AI Twin Workspace',
        status: 'Case study coming soon',
        image: doubleAiImg,
      },
      {
        eyebrow: '02',
        title: 'Quilo AI',
        description: 'Workflow Builder',
        status: 'Case study coming soon',
        image: quiloAiImg,
      },
      {
        eyebrow: '03',
        title: 'Maruti Suzuki',
        description: 'Digital Cockpit UX',
        status: 'Case study coming soon',
        image: marutiSuzukiImg,
      },
      {
        eyebrow: '04',
        title: 'Formula 1 Youtube',
        description: 'Interactive Race Dashboard',
        status: 'Case study coming soon',
        image: formula1Img,
      },
      {
        eyebrow: '05',
        title: 'U3K',
        description: 'Heads-up Display Interface',
        status: 'Concept details coming soon',
        image: u3kImg,
      },
    ],
  },
  builds: {
    id: 'builds',
    title: 'Builds',
    tone: 'builds',
    projects: [
      {
        eyebrow: '01',
        title: 'AI Twin',
        description: 'AI Twin Workspace',
        status: 'Open build',
        image: aiTwinImg,
        link: 'https://jatindavistwin.vercel.app/',
      },
      {
        eyebrow: '02',
        title: 'AI Website',
        description: 'AI-Generated Web Experience',
        status: 'Open build',
        image: aiWebsiteImg,
        link: 'https://websitedesign-ten.vercel.app/',
      },
      {
        eyebrow: '03',
        title: 'AI UI',
        description: 'Generative UI Sandbox',
        status: 'Open build',
        image: aiUiImg,
        link: 'https://agenticui.netlify.app/',
      },
      {
        eyebrow: '04',
        title: 'Skills.md',
        description: 'Markdown Skills Portfolio',
        status: 'Open build',
        image: skillsMdImg,
        link: 'https://aiskillsmd.netlify.app/',
      },
    ],
  },
};

export const CONTACT = {
  title: 'Contact',
  links: [
    { label: 'Jatindavis5@gmail.com', href: 'mailto:Jatindavis5@gmail.com' },
    { label: '8920152733', href: 'tel:8920152733' },
    { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
    { label: 'YouTube', href: 'https://youtube.com', external: true },
  ],
};
