import doubleAiImg from '../images/Double AI.png';
import formula1Img from '../images/Formula 1 Youtube.png';
import marutiSuzukiImg from '../images/Maruti Suzuki.png';
import quiloAiImg from '../images/Quilo AI.png';
import u3kImg from '../images/U3K.png';
import aiTwinImg from '../images/builds/AITWIN.png';
import aiWebsiteImg from '../images/builds/AIWebsite.png';
import aiUiImg from '../images/builds/AIUIdesignSystem.png';
import skillsMdImg from '../images/builds/SKILLSMD.png';
import resumePdf from './jatindavisresume.pdf';


export const SECTIONS = [
  { id: 'home', navLabel: 'HOME', label: 'Home' },
  { id: 'about', navLabel: 'ABOUT', label: 'About' },
  { id: 'work', navLabel: 'WORK', label: 'Work' },
  { id: 'builds', navLabel: 'BUILDS', label: 'Builds' },
  { id: 'contacts', navLabel: 'CONTACTS', label: 'Contacts' },
];

export const HERO = {
  title: 'Product designer & builder, shipping experiences that create impact.',
  summary:
    'Product designer working on AI twin agent experience @Cardtree AI. Prev. product designer at Maruti Suzuki.',
  actions: [
    { label: 'Work', target: 'WORK', variant: 'accent' },
    { label: 'Resume', href: resumePdf, download: 'Jatin Davis Resume.pdf', variant: 'secondary', external: true },
  ],
};

export const ABOUT = {
  title: 'About',
  body: [
    'Currently a Ai native Product Designer at Cardtree AI and working on the product Double AI, focused on crafting the user experience for AI twin agents.',
    'Previous role as a Product Designer at Maruti Suzuki involved designing next-generation digital instrument clusters and infotainment systems.',
    'Hold a Master of Design from Jamia Millia Islamia, which led to placement at Maruti Suzuki.',
  ],
  visualLabels: ['Systems', 'Motion', 'Automotive', 'AI UX', 'Tools'],
};

export const PROJECT_GROUPS = {
  work: {
    id: 'work',
    title: 'Work',
    tone: 'work',
    projects: [
      {
        id: 'double-ai',
        eyebrow: '01',
        title: 'Double AI - AI Twin Agent',
        description: 'Designed 0-1 features as the product pivoted and features scaled.',
        status: 'Case study coming soon',
        image: doubleAiImg,
      },
      {
        id: 'maruti-suzuki-smartplay',
        eyebrow: '02',
        title: 'Maruti Suzuki',
        description: 'Smartplay Pro X infotainment system',
        status: 'Case study coming soon',
        image: marutiSuzukiImg,
      },
      {
        id: 'quilo',
        eyebrow: '03',
        title: 'Quilo Chrome Extension',
        description: 'AI prompt library browser extension',
        status: 'Case study coming soon',
        image: quiloAiImg,
      },
      {
        id: 'formula-1-design',
        eyebrow: '04',
        title: 'F1 YouTube Channel',
        description: 'Visual storytelling & niche content channel',
        status: 'Case study coming soon',
        image: formula1Img,
      },
      {
        id: 'u3k-instrument-cluster',
        eyebrow: '05',
        title: 'U3K IC, Maruti Suzuki',
        description: 'Next-gen segmented digital instrument cluster',
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
    { label: 'LINKEDIN', href: 'https://linkedin.com', external: true },
    { label: 'YOUTUBE', href: 'https://youtube.com', external: true },
  ],
};
