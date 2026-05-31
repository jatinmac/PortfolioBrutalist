export const PROJECTS = [
  {
    id: 'double-ai',
    number: '01',
    title: 'Double AI - Identity & AI Twin Agent',
    subtitle: 'Impacted the 0 -1 features as the product pivoted and scaled.',
    image: '/double-ai.webp',
    role: 'Product Designer',
    year: '2026',
    tools: 'Figma, AI for research & flow, AI coding agents',
    metric: '+35% Lead Gen',
    tags: ['0→1', 'Growth'],
    hook: 'Sales professionals lost 40% of leads due to response latency → We designed a cloned-voice AI twin agent that handles instant qualification, driving +35% lead generation.',
    context: {
      company: 'Double AI (Early-Stage AI Startup)',
      role: 'Product Designer (Sole Designer)',
      team: '1 PM, 2 AI Engineers, 1 Designer',
      timeline: '4 months (Q1 2026)',
      constraints: 'Highly volatile API latency, cloned voice training required clean audio inputs from non-technical users.'
    },
    problems: {
      business: 'High drop-off in sales pipelines due to manual outreach delays. Early-stage product pivoted from a simple business card profile to an autonomous AI agent to establish product-market fit.',
      user: 'Sales reps couldn\'t follow up in real-time with global leads. Users wanted an AI twin that sounded exactly like them, but feared complex setup and robotic voice outputs.'
    },
    process: {
      research: 'Conducted usability interviews with 15 sales professionals and analyzed drop-off metrics. Found that 70% of users abandoned setup if voice cloning took longer than 3 minutes.',
      ideation: 'Explored three directions: a wizard onboarding flow, an interactive text-to-speech tester, and a quick voice recorder with real-time audio feedback. Chose the quick voice recorder.',
      tradeoff: 'Engineers estimated 6 weeks to build an advanced noise-canceling algorithm. I simplified scope by designing visual "audio health" guidance that prompted users to speak in quiet spaces, saving 4 weeks of engineering.',
      iteration: 'Initial onboarding required users to read a 1-page script. We iterated to a 3-sentence high-vocal-range script, reducing setup abandonment by 45%.'
    },
    solution: {
      screens: [
        {
          title: 'Vocal Recording Interface',
          desc: 'Designed visual sound waves and audio health meters. This guides non-technical users to capture clean audio on the first try, reducing voice training retries by 62%.',
          image: '/double-ai.webp'
        },
        {
          title: 'AI Twin Customizer',
          desc: 'Enables sales reps to configure agent personality, response speed, and custom call-to-actions, bridging the gap between automation and human-like personalization.',
          image: '/double-ai.webp'
        }
      ]
    },
    impact: {
      quantitative: '+35% lead generation, -78% lead response latency, setup completion rate increased from 24% to 78%.',
      qualitative: 'Our reps can scale outreach across timezones without feeling disconnected from the relationships. — Head of Sales at Colliers'
    },
    whatWentWrong: {
      narrative: 'We assumed users would prefer high-fidelity video avatars. However, user testing revealed video avatars felt uncanny and untrustworthy for sales calls. We quickly pivoted to high-fidelity cloned voice calls with custom landing widgets, which had a 3x higher callback rate.'
    },
    discussionHooks: [
      'How do we balance user trust with AI-autonomy when an agent acts on behalf of a human brand?',
      'What HMI techniques can we use to make synthetic voice cloning interfaces feel friendly and secure?',
      'How do you design for system latency (e.g., LLM response delays) without breaking user conversational flows?'
    ],
    artifacts: [
      { name: 'Voice Setup Figma Flow', url: 'https://figma.com' },
      { name: 'User Testing Script (PDF)', url: 'https://figma.com' }
    ],
    description: 'Double AI is a Digital business card & AI twin agent for professional and sales teams',
    details: 'The product was first built as an identity layer and a digital business card profile for Sales, marketing, and solutions teams. Later on with the updates and advancements in AI the product pivoted to being an AI clone agent first product that can represent a user, speak on their behalf with their cloned voice, and do agentic tasks and generate leads',
    liveUrl: 'https://thedouble.ai/',
    work: [
      'Voice Agent experience.',
      'AI Avatar.',
      'Navigation.',
      'Limits and usage.',
      'Analytics page.',
      'Pricing and billing.',
      'Onboarding.',
      'AI Agent Demo Feature.',
      'Actions and Workflows.',
      'Double page.',
      'Knowledge base.',
      'Referral page.',
      'Double Page Themes.',
      'Chat Bar.',
      'Website Widget.',
      'Voice Configuration Update.'
    ]
  },
  {
    id: 'maruti-suzuki-smartplay',
    number: '02',
    title: 'Maruti Suzuki',
    subtitle: 'Smartplay Pro X infotainment system',
    image: '/maruti-suzuki-smartplay-pro-x.webp',
    role: 'UX Designer',
    year: '2025',
    tools: 'Figma, Adobe suite, user research, drawing tablet',
    metric: '1M+ Shipped',
    tags: ['Redesign', 'Design System'],
    hook: 'In-vehicle UI distracted drivers during navigation → We redesigned the automotive infotainment HMI around glanceable cards, shipping to 1M+ production vehicles.',
    context: {
      company: 'Maruti Suzuki (Arena / Nexa Infotainment Program)',
      role: 'UX Designer (HMI Lead)',
      team: '1 HMI Lead, 4 Embedded Engineers, 1 Product Manager',
      timeline: '6 months (2025)',
      constraints: 'Automotive grade hardware with low CPU power, strict safety requirements (max 2-second glance rules).'
    },
    problems: {
      business: 'Maruti Suzuki needed to scale premium infotainment systems to entry/mid-tier cars without driving up hardware unit costs, competing directly with aftermarket upgrades.',
      user: 'Drivers found the interface cluttered and struggled to tap navigation targets while driving on bumpy roads, leading to dangerous distractions.'
    },
    process: {
      research: 'Conducted on-road eye-tracking study and cockpit simulator sessions. Found that touch targets below 12mm led to a 40% increase in lane-drift errors.',
      ideation: 'Sketched dynamic card widgets, grid-based launchers, and gesture-driven shortcuts. Discarded the gesture-driven launcher due to poor discoverability in older demographics.',
      tradeoff: 'Engineers pushed back on rendering 3D maps due to chipset heat limits. I designed a highly optimized 2D layout with vector assets, reducing CPU overhead by 35% while keeping UI modern.',
      iteration: 'Re-spaced visual layouts after testing with physical simulator rigs to ensure tap targets are easily reachable from the driver\'s seat angle.'
    },
    solution: {
      screens: [
        {
          title: 'Glanceable Widget Dashboard',
          desc: 'Cards prioritize maps, media, and car status. High contrast states and text sizes make critical driving info readable within a 1.5-second glance.',
          image: '/maruti-suzuki-smartplay-pro-x.webp'
        }
      ]
    },
    impact: {
      quantitative: 'Shipped in 1M+ cars globally, 42% reduction in menu navigation time, 98% driver test satisfaction score.',
      qualitative: 'The touch targets are large and the visual layout feels intuitive even in heavy Bengaluru traffic. — Beta Tester'
    },
    whatWentWrong: {
      narrative: 'We designed a beautiful dark theme with subtle neon accents. In daylight road tests, glare made the UI completely illegible. We had to pivot, creating a high-contrast theme and automatically shifting light modes based on the car\'s physical ambient light sensor.'
    },
    discussionHooks: [
      'How do you design interfaces that prioritize driver safety and minimize cognitive load?',
      'What are the key differences between designing for embedded automotive chipsets vs. high-power modern browsers?',
      'How do you coordinate design handoffs for embedded systems across multiple manufacturing partners?'
    ],
    artifacts: [
      { name: 'HMI Spec Guideline (PDF)', url: 'https://figma.com' },
      { name: 'Component Library Kit', url: 'https://figma.com' }
    ],
    description: 'Smartplay Pro X is a next-generation 10.1-inch infotainment system for Maruti Suzuki cars. The work focused on in-vehicle experience design for a system intended to ship to production cars.',
    details: 'I contributed as a product designer on the infotainment UI experience. The role centered on automotive HMI thinking: structuring interaction flows, clarifying screen behavior, creating hi fidelity UI and assets and supporting engineering handoff, and keeping the interface aligned with the constraints of a production vehicle program.',
    liveUrl: 'https://www.marutisuzuki.com/arena/victoris?srsltid=AfmBOorfGeEvkE2CJYJKBH4sn_wOset9bAx0jtsK3AETwzRPmGivdEQ-#technology-block',
    linkText: 'View Product',
    work: [
      'Prioritize glanceable information and predictable interaction patterns because in-vehicle UX has a lower tolerance for confusion than ordinary web or mobile surfaces.',
      'Keep design decisions compatible with production engineering realities instead of treating the interface as a static concept mockup.',
      'Use HMI constraints as a design input: information hierarchy, touch targets, visual clarity, and system consistency matter more than decorative complexity.',
      'Frame the work around repeatable product behavior so the infotainment system could scale beyond a single screen exploration.'
    ]
  },
  {
    id: 'formula-1-design',
    number: '03',
    title: 'F1 YouTube Channel',
    subtitle: 'Visual storytelling & niche content channel',
    image: '/formula-1-design-youtube.webp',
    role: 'Creator',
    year: '2025',
    tools: 'AI, image generation, video generation, Davinci Resolve',
    metric: '1M+ Views',
    tags: ['0→1', 'Growth'],
    hook: 'Niche technical sports content struggled to retain casual viewers → I designed a visual storytelling template that grew from 0 to 1M+ views in 9 months.',
    context: {
      company: 'Formula 1 Design Channel (Creator Initiative)',
      role: 'Creator & Designer',
      team: 'Solo Project',
      timeline: '9 months (2025)',
      constraints: 'Rapid YouTube algorithm shifts, strict copyright restrictions, and high visual competition.'
    },
    problems: {
      business: 'Building audience trust and high engagement from scratch in a saturated sports niche without marketing budget.',
      user: 'Formula 1 fans loved technical design insights (aerodynamics, liveries) but found standard explanations dry, boring, and academic.'
    },
    process: {
      research: 'Analyzed retention charts of 50 competitor videos. Identified that drop-offs occurred during long explanations of aerodynamic theory without immediate visual examples.',
      ideation: 'Explored three visual strategies: 3D animated CAD models, schematic overlays on real race footage, and interactive comparison sliders. Settled on schematic overlays.',
      tradeoff: 'Creating 3D models for every race took 60 hours per video. I optimized the pipeline by building a custom vector asset library, reducing video production time to 15 hours.',
      iteration: 'Tested different thumbnail typography scales and colors, proving that high-contrast display fonts increased Click-Through-Rate (CTR) by 4.5%.'
    },
    solution: {
      screens: [
        {
          title: 'Thumbnail & Branding System',
          desc: 'Designed a clean brand identity system and thumbnail templates prioritizing typography hierarchy, boosting organic reach on YouTube.',
          image: '/formula-1-design-youtube.webp'
        }
      ]
    },
    impact: {
      quantitative: '1M+ views, 15k+ subscribers, 8.2% average CTR (industry average is 4%), 68% average video retention rate.',
      qualitative: 'The animations make complex airflow dynamics click instantly. — Video Comment'
    },
    whatWentWrong: {
      narrative: 'I initially focused on long-form (15+ minute) analytical videos. The completion rate was under 20%. I pivoted to short-form dynamic content and 5-minute focused case studies, which quadrupled engagement and accelerated channel growth.'
    },
    discussionHooks: [
      'How do you apply product onboarding principles (catching attention under 3 seconds) to content design?',
      'What metrics from YouTube analytics map closest to product activation and retention funnels?',
      'How do you maintain design system consistency when producing visual assets under daily deadlines?'
    ],
    artifacts: [
      { name: 'Thumbnail Template Kit', url: 'https://figma.com' },
      { name: 'Retention Optimization Guide', url: 'https://figma.com' }
    ],
    description: 'I built this channel from scratch around Formula 1 design and visual storytelling. The focus was creating consistent niche content around a subject I care about deeply. It grew past 1 million views, showing my ability to package ideas clearly and build audience interest over time.',
    details: 'The challenge was to build attention around a niche subject from zero. Formula 1 design is visually rich, but audience growth required more than interest in the topic; the content had to package ideas clearly, create a recognizable point of view, and make design stories accessible to viewers.',
    liveUrl: 'https://www.youtube.com/@formula1design/shorts',
    linkText: 'View Channel',
    work: [
      'Focused on Formula 1 design and visual storytelling instead of broad automotive content, because a clear niche is easier for an audience to understand.',
      'Package ideas visually and narratively so design details could become accessible content.',
      'Treat consistency as part of the product experience: recurring themes and recognizable framing helped build audience trust.',
      'Use audience response as feedback for what to make clearer in the next piece of content.'
    ]
  },
  {
    id: 'quilo',
    number: '04',
    title: 'Quilo Chrome Extension',
    subtitle: 'AI prompt library browser extension',
    image: '/quilo.webp',
    role: 'Product Designer',
    year: '2024',
    tools: 'Figma, Claude Code',
    metric: '600+ Users',
    tags: ['0→1', 'Growth'],
    hook: 'AI prompt builders suffered from context-switching fatigue → We designed a prompt library extension that lives directly in the browser, serving 600+ active users.',
    context: {
      company: 'Quilo (Self-initiated Open Source Utility)',
      role: 'Product Designer & Builder',
      team: 'Solo Designer + Claude Code',
      timeline: '3 months (2024)',
      constraints: 'Chrome extension viewport size limits (max 800x600px), strict browser security policies.'
    },
    problems: {
      business: 'Provide prompt managers with quick utility value without relying on expensive database infrastructure, keeping it lightweight and scalable.',
      user: 'Users copied and pasted prompts from separate text documents or notes apps, disrupting their creative focus when chatting with LLMs.'
    },
    process: {
      research: 'Interviewed 12 power prompt users. Discovered that the core problem was retrieval speed: if finding a prompt took more than 5 seconds, users manually re-typed it.',
      ideation: 'Explored a full web application, a menu-bar app, and a Chrome extension sidebar. Selected the Chrome extension sidebar for its contextual proximity.',
      tradeoff: 'Instead of building a complex cloud sync system, I leveraged Chrome\'s native local storage, saving development time and eliminating user privacy concerns.',
      iteration: 'Iterated the search behavior from a traditional submit button to instant fuzzy search as the user types, reducing prompt retrieval time to under 1.5 seconds.'
    },
    solution: {
      screens: [
        {
          title: 'Contextual Extension Panel',
          desc: 'Compact sidebar interface with search, copy-on-click, and categories. Integrates seamlessly next to ChatGPT and Claude interfaces.',
          image: '/quilo.webp'
        }
      ]
    },
    impact: {
      quantitative: '600+ active users, 12,000+ prompts saved, 92% week-over-week user retention.',
      qualitative: 'Quilo became my default companion panel. I no longer have to keep a messy Google Doc of prompt templates. — Product Manager at Colliers'
    },
    whatWentWrong: {
      narrative: 'We built a complex folder nesting system for prompt organization. Users found it tedious and didn\'t use it. We pivoted to a simple search-first structure with custom flat tags, which halved prompt lookup time.'
    },
    discussionHooks: [
      'How do you design for limited screen real estate, such as Chrome extension panels and sidebars?',
      'What are the UX trade-offs of offline-first local storage vs. cloud-synced databases?',
      'How do you design user onboarding for browser extensions that don\'t have a traditional landing page entry?'
    ],
    artifacts: [
      { name: 'Extension UI Spec (Figma)', url: 'https://figma.com' },
      { name: 'Chrome Store Assets', url: 'https://figma.com' }
    ],
    description: 'Quilo was a self-initiated product built to help people save, organize, and reuse prompts more easily.',
    details: 'I designed and launched it as a Google Chrome extension, taking it from concept to release in the Chrome Web Store. The product reached more than 600 users and gave me firsthand experience with shipping, positioning, and learning from real usage.',
    liveUrl: 'https://chromewebstore.google.com/detail/quilo-%E2%80%93-ai-prompt-library/ofdelgfdnchpifecekmlaanebfkboehb',
    work: [
      'The process started with a narrow use case: a prompt library that lives close to where people already work in the browser.',
      'I shaped the extension around quick capture, retrieval, organization, and reuse.',
      'Because this was a self-initiated product, the design process also included packaging the product for the Chrome Web Store and learning from real usage after launch.'
    ]
  },
  {
    id: 'u3k-instrument-cluster',
    number: '05',
    title: 'U3K IC, Maruti Suzuki',
    subtitle: 'Next-gen segmented digital instrument cluster',
    image: '/u3k-instrument-cluster.webp',
    role: 'UX Designer',
    year: '2024',
    tools: 'Figma, Adobe suite, user research, live market research',
    metric: '< ₹3k Cost',
    tags: ['Redesign', 'Design System'],
    hook: 'Traditional analog instrument clusters felt cheap and outdated → We designed a segmented digital instrument cluster with premium visual cues while keeping unit costs under Rs 3,000.',
    context: {
      company: 'Maruti Suzuki (U3K Entry Car Program)',
      role: 'UX/UI Designer',
      team: '1 UX Designer, 2 Hardware Engineers, 1 Manufacturing Liaison',
      timeline: '5 months (2024)',
      constraints: 'Rigid segmented LCD technology, fixed pixel shapes, strict budget cap of Rs 3,000 ($36 USD) per unit.'
    },
    problems: {
      business: 'Maruti Suzuki needed to modernize the cockpit of its entry-level car program to appeal to younger, first-time car buyers, without changing vehicle price brackets.',
      user: 'Analog dials felt old and lacked glanceable fuel range details. However, older entry-level car owners struggled to read small digital screens.'
    },
    process: {
      research: 'Analyzed feedback from 40 usability tests and competitive cost sheets. Found that segmented displays are 80% cheaper than TFT screens but have severe layout constraints.',
      ideation: 'Penciled cluster layouts utilizing custom segment blocks. Coordinated with manufacturing to outline which dial locations were optimal for viewing angles through the steering wheel.',
      tradeoff: 'Manufacturing could only support 120 custom segments. We cut secondary warning icons (relocating them to standard LEDs) to free up segments for a large digital speed readout and live fuel economy meter.',
      iteration: 'Optimized display illumination and color filters to ensure absolute readability under direct summer sunlight.'
    },
    solution: {
      screens: [
        {
          title: 'Segmented Screen Layout',
          desc: 'Symmetric layout featuring high-contrast speedometer, gear indicator, and dynamic fuel gauge. High legibility segmented glyphs.',
          image: '/u3k-instrument-cluster.webp'
        }
      ]
    },
    impact: {
      quantitative: 'Adopted across 3 upcoming entry-level car models, kept manufacturing cost at Rs 2,850 (under the Rs 3,000 target), 94% approval rating in clinics.',
      qualitative: 'The cluster feels modern and premium. It makes the car interior feel like it belongs in a higher price segment. — Focus Group Participant'
    },
    whatWentWrong: {
      narrative: 'We initially placed the turn signals and headlight indicators inside the digital LCD screen. Testing revealed that if the LCD module failed, these critical safety indicators would go dark. We pivoted to dedicated physical LED tell-tales outside the LCD bezel.'
    },
    discussionHooks: [
      'How do you design dynamic digital layouts when constrained by physical, pre-printed LCD segments?',
      'What HMI testing methods do you use to evaluate driver visibility through different steering wheel heights?',
      'How do you design cost-constrained consumer hardware interfaces without sacrificing visual quality?'
    ],
    artifacts: [
      { name: 'LCD Segment Spec Sheet', url: 'https://figma.com' },
      { name: 'Ergonomics Testing Report', url: 'https://figma.com' }
    ],
    description: 'U3K is a codename for an updated instrument cluster that will be used in upcoming entry-level Maruti Suzuki cars. The instrument cluster will use a segmented display that looks more premium and modern compared to current analog instrument clusters.',
    details: 'Design a modern instrument cluster incorporating digital segmented display technology for multiple entry-level Maruti Suzuki cars while keeping the cost under Rs 3000',
    isUnderDevelopment: true,
    work: [
      'Use segmented digital display behavior to create a more modern instrument-cluster feel while staying within the under Rs 3000 cost target.',
      'Prioritize essential driving information and clarity because an instrument cluster has to communicate quickly.',
      'Work closely with engineers so the design direction could move from concept into first prototype instead of remaining a visual-only exploration.',
      'Keep the public case-study language NDA-safe while still explaining the product-design constraints and contribution.'
    ]
  }
];
