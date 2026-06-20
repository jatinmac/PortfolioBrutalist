export const PROJECTS = [
  {
    id: 'double-ai',
    number: '01',
    title: 'Double AI - AI Twin Agent',
    subtitle: 'Designed 0-1 features as the product pivoted and features scaled.',
    image: '/double-ai.webp',
    role: 'Product Designer',
    year: '2026',
    tools: 'Figma, AI for research & flow, AI coding agents',
    tags: ['AI twin', 'AI SaaS', 'voice agent', 'identity'],
    hook: 'High-intent visitors drop off, conversion suffers, and expensive human time gets spent on repeat conversations → We designed a cloned-voice AI twin agent that handles instant qualification, driving lead generation.',
    context: {
      company: 'Double AI (Early-Stage AI Startup)',
      role: 'Product Designer (Sole Designer)',
      team: 'Founder, 5 Engineers',
      timeline: '6 months (Q1 2026)',
      constraints: 'Highly volatile API latency, cloned voice training required clean audio inputs from users.'
    },
    problems: {
      business: 'LinkedIn, websites, portfolios, and bio pages show who you are, but they cannot respond to visitors’ questions. Chatbots can answer, but they are not grounded in a real person’s voice, knowledge, proof, brand, rules, and workflows.',
      user: 'Founders, sales teams, recruiters, creators, and consultants repeat the same explanations, demos, and qualification conversations.'
    },
    process: {
      research: 'The founder was the former Head of Marketing at Exotel. He identified gaps and opportunities in the sales workflows, benchmarked products offering voice agents, compared and improved our product against them, and identified Agentic AI as the path forward.',
      ideation: 'Quick ideation on problems identified and the path taken based on product strategy.',
      tradeoff: 'We prioritized speed over perfect execution, as we were (and still are) looking to raise funding and needed a quick demo product.',
      iteration: 'Iterated designs based on the analysis of user recordings and feedback.'
    },
    impact: {
      quantitative: 'Campaigns are active as we speak to raise funds and find users.',
      qualitative: 'Positive feedback from founders and venture capitalists.'
    },
    whatWentWrong: {
      narrative: 'Our product originally solved for identity and digital business card needs, but AI models since January 2026 improved massively to the point where our product was threatened by general agents. We pivoted to a more agentic platform as agents were becoming popular and useful.'
    },
    description: 'Double AI is a digital business card and AI twin agent for professionals and sales teams.',
    details: 'The product was first built as an identity layer and a digital business card profile for sales, marketing, and solutions teams. Later, with advancements in AI, the product pivoted to an AI clone agent-first product that can represent a user, speak on their behalf with their cloned voice, perform agentic tasks, and generate leads.',
    liveUrl: 'https://thedouble.ai/',
    linkText: 'View Product',
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
    id: 'quilo',
    number: '02',
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
    impact: {
      quantitative: '600+ active users, 12,000+ prompts saved, 92% week-over-week user retention.',
      qualitative: 'Quilo became my default companion panel. I no longer have to keep a messy Google Doc of prompt templates. — Product Manager at Colliers'
    },
    whatWentWrong: {
      narrative: 'We built a complex folder nesting system for prompt organization. Users found it tedious and didn\'t use it. We pivoted to a simple search-first structure with custom flat tags, which halved prompt lookup time.'
    },
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
    id: 'maruti-suzuki-smartplay',
    number: '03',
    title: 'Maruti Suzuki',
    subtitle: 'Smartplay Pro X infotainment system',
    image: '/maruti-suzuki-smartplay-pro-x.webp',
    role: 'UX Designer',
    year: '2025',
    tools: 'Figma, Adobe suite, user research, drawing tablet',
    metric: 'MS Victoris 2025',
    tags: ['10.1 inch', 'Infotainment HMI', 'Automotive UI'],
    hook: 'Maruti Suzuki needed an update to their infotainment system → We designed the 10.1-inch automotive infotainment HMI around new functionality with an updated UI and visual overhaul.',
    context: {
      company: 'Maruti Suzuki (Arena / Nexa Infotainment Program)',
      role: 'UX Designer (HMI)',
      team: '2 designers, 1 engineer, 2 Bosch engineers',
      timeline: '1 year',
      constraints: 'Automotive-grade hardware with low CPU power, car mechanical requirements, and strict safety requirements.'
    },
    problems: {
      business: 'Maruti Suzuki needed to update their infotainment systems for B and C segment cars.',
      user: 'Drivers found the interface laggy and needed wireless Apple CarPlay / Android Auto.'
    },
    process: {
      research: 'Conducted market research and competitive benchmarking against rival brands.',
      ideation: 'Ideated on user flows, visual assets, and incorporated feedback from senior leadership.',
      tradeoff: 'Screen size and aspect ratio limitations compared to smartphones and laptops, and lower processing power compared to smartphone and laptop computers.',
      iteration: 'Redesigned and iterated on assets and layout based on leadership feedback.'
    },
    impact: {
      quantitative: 'Shipped in all Maruti Suzuki Victoris cars in India.',
      qualitative: 'Bigger screen unit with Alexa, wireless CarPlay, and Android Auto.'
    },
    whatWentWrong: {
      narrative: 'We designed a beautiful dark theme with subtle neon accents. In daylight road tests, glare made the UI completely illegible. We had to pivot, creating a high-contrast theme and automatically shifting light modes based on the car\'s physical ambient light sensor.'
    },
    description: 'Smartplay Pro X is a next-generation 10.1-inch infotainment system for Maruti Suzuki cars. The work focused on in-vehicle experience design for a system intended to ship to production cars.',
    details: 'I contributed as a product designer on the infotainment UI experience. The role centered on automotive HMI thinking: structuring interaction flows, clarifying screen behavior, creating high-fidelity UI and assets, supporting engineering handoff, and keeping the interface aligned with the constraints of a production vehicle program.',
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
    number: '04',
    title: 'F1 YouTube Channel',
    subtitle: 'Visual storytelling & niche content channel',
    image: '/formula-1-design-youtube.webp',
    role: 'Creator',
    year: '2025',
    tools: 'AI, image generation, video generation, Davinci Resolve',
    metric: '1M+ Views',
    tags: ['YouTube channel', 'Formula 1 content'],
    hook: 'I wanted to use AI to bring classic and vintage F1 cars to life and experiment with their liveries.',
    context: {
      company: 'Formula 1 Design Channel (Creator Initiative)',
      role: 'Creator & Designer',
      team: 'Solo Project',
      timeline: '3 months (2025)',
      constraints: 'Rapid YouTube algorithm shifts, strict copyright restrictions, and high visual competition.'
    },
    problems: {
      business: 'Understanding the audience and their preferences.',
      user: 'Formula 1 fans loved technical design insights (aerodynamics, liveries) but found standard explanations dry, boring, and academic.'
    },
    process: {
      research: 'Analyzed retention charts of 50 competitor videos. Identified that drop-offs occurred during long explanations of aerodynamic theory without immediate visual examples.',
      ideation: 'Explored three visual strategies: 3D animated CAD models, schematic overlays on real race footage, and interactive comparison sliders. Settled on schematic overlays.',
      tradeoff: 'Creating 3D models for every race took 60 hours per video. I optimized the pipeline by building a custom vector asset library, reducing video production time to 15 hours.',
      iteration: 'Tested different thumbnail typography scales and colors, proving that high-contrast display fonts increased Click-Through Rate (CTR) by 4.5%.'
    },
    impact: {
      quantitative: '1M+ views, 1k subscribers, 8.2% average CTR (industry average is 4%), 68% average video retention rate.',
      qualitative: '“The animations make complex airflow dynamics click instantly.” — Video Comment'
    },
    whatWentWrong: {
      narrative: 'I initially focused on long-form (15+ minute) analytical videos. The completion rate was under 20%. I pivoted to short-form dynamic content and 5-minute focused case studies, which quadrupled engagement and accelerated channel growth.'
    },
    description: 'I built this channel from scratch around Formula 1 design and visual storytelling. The focus was on creating consistent niche content around a subject I care about deeply. It grew past 1 million views, showing my ability to package ideas clearly and build audience interest over time.',
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
    hook: 'Traditional analog instrument clusters felt cheap and outdated → We designed a segmented digital instrument cluster with premium visual cues while keeping unit costs under ₹3,000.',
    context: {
      company: 'Maruti Suzuki (U3K Entry Car Program)',
      role: 'UX/UI Designer',
      team: '1 UX Designer, 2 Hardware Engineers, 1 Manufacturing Liaison',
      timeline: '5 months (2024)',
      constraints: 'Rigid segmented LCD technology, fixed pixel shapes, strict budget cap of ₹3,000 ($36 USD) per unit.'
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
    impact: {
      quantitative: 'Adopted across 3 upcoming entry-level car models, kept manufacturing cost at ₹2,850 (under the ₹3,000 target), 94% approval rating in clinics.',
      qualitative: 'The cluster feels modern and premium. It makes the car interior feel like it belongs in a higher price segment. — Focus Group Participant'
    },
    whatWentWrong: {
      narrative: 'We initially placed the turn signals and headlight indicators inside the digital LCD screen. Testing revealed that if the LCD module failed, these critical safety indicators would go dark. We pivoted to dedicated physical LED tell-tales outside the LCD bezel.'
    },
    description: 'U3K is the codename for an updated instrument cluster that will be used in upcoming entry-level Maruti Suzuki cars. The instrument cluster will use a segmented display that looks more premium and modern compared to current analog instrument clusters.',
    details: 'Design a modern instrument cluster incorporating digital segmented display technology for multiple entry-level Maruti Suzuki cars while keeping the cost under ₹3,000.',
    isUnderDevelopment: true,
    work: [
      'Use segmented digital display behavior to create a more modern instrument-cluster feel while staying within the under ₹3,000 cost target.',
      'Prioritize essential driving information and clarity because an instrument cluster has to communicate quickly.',
      'Work closely with engineers so the design direction could move from concept into first prototype instead of remaining a visual-only exploration.',
      'Keep the public case-study language NDA-safe while still explaining the product-design constraints and contribution.'
    ]
  }
];
