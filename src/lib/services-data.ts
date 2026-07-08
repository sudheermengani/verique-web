export type Feature = { title: string; description: string };
export type Step = { title: string; description: string };
export type Outcome = { title: string; description: string };
export type Faq = { question: string; answer: string };

export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  overviewList: string[];
  seoTitle: string;
  seoDescription: string;
  h1: string;
  lede: string;
  featuresEyebrow: string;
  featuresHeading: string;
  features: Feature[];
  stepsEyebrow: string;
  stepsHeading: string;
  steps: Step[];
  outcomesHeading: string;
  outcomes: Outcome[];
  faqs: Faq[];
};

export const services: Service[] = [
  {
    slug: "lead-generation",
    name: "Lead Generation",
    shortDescription:
      "Complete lead generation systems: funnel, landing pages, qualification, CRM integration and end-to-end tracking. Enquiries arrive qualified and ready to talk.",
    overviewList: [
      "Lead generation funnels",
      "High-converting landing pages",
      "Lead qualification & scoring",
      "CRM integration & instant alerts",
      "Cost-per-lead tracking & reporting",
    ],
    seoTitle: "Lead Generation Services UK | Qualified Leads & Appointments | Verique",
    seoDescription:
      "Verique builds complete lead generation systems for UK businesses: funnels, landing pages, lead qualification, CRM integration and tracking. Book a free consultation.",
    h1: "Lead generation that fills your calendar, not your spam folder.",
    lede: "We build the full system — ads, landing pages, qualification, follow-up — so enquiries arrive pre-qualified and ready to talk. Not a list of cold names. Booked appointments with people who want what you sell.",
    featuresEyebrow: "What's included",
    featuresHeading: "A complete system, not a list of leads",
    features: [
      {
        title: "Lead generation systems",
        description:
          "End-to-end pipelines built around your offer: traffic source, landing page, qualification and booking — designed as one machine, measured as one machine.",
      },
      {
        title: "Funnels that qualify",
        description:
          "Multi-step funnels that filter out tyre-kickers before they reach you. You speak to people who match your criteria: budget, location, timeline.",
      },
      {
        title: "High-converting landing pages",
        description:
          "Purpose-built pages for each campaign — fast, mobile-first, and written to convert. No sending paid traffic to a generic homepage.",
      },
      {
        title: "Lead qualification process",
        description:
          "Screening questions, conditional forms and scoring rules agreed with you upfront, so 'lead' means the same thing to us as it does to your sales team.",
      },
      {
        title: "CRM integration",
        description:
          "Every lead lands in your CRM instantly with full source data. Automated notifications, follow-up sequences, and no enquiry left sitting overnight.",
      },
      {
        title: "Lead tracking & reporting",
        description:
          "You see cost per lead, cost per qualified lead, and cost per appointment — by campaign, by ad, by keyword. Real numbers, updated continuously.",
      },
    ],
    stepsEyebrow: "How it works",
    stepsHeading: "From first call to first lead",
    steps: [
      {
        title: "Discovery & offer review",
        description:
          "We map how you currently get customers, what a lead is worth to you, and what your capacity looks like. If the numbers don't work, we tell you before you spend anything.",
      },
      {
        title: "System build",
        description:
          "We build the funnel: landing pages, forms, qualification logic, CRM connections and tracking. Typically live within two to three weeks.",
      },
      {
        title: "Traffic on",
        description:
          "Campaigns launch on the channels that fit your market — usually Meta, Google, or both. Budgets start controlled and scale with results.",
      },
      {
        title: "Qualify & optimise",
        description:
          "We review lead quality with you weekly in the early stages. Targeting, creative and qualification rules are tightened based on what your team reports back.",
      },
      {
        title: "Scale what works",
        description:
          "Once cost per qualified lead is stable and quality is confirmed, we scale spend, add channels, and expand into new offers or locations.",
      },
    ],
    outcomesHeading: "What a working system gives you",
    outcomes: [
      {
        title: "Predictable enquiry flow",
        description: "A consistent weekly volume of enquiries you can plan staffing and capacity around.",
      },
      {
        title: "Known acquisition cost",
        description: "A clear cost per lead and per appointment, so you can decide exactly how much growth to buy.",
      },
      {
        title: "Full pipeline visibility",
        description: "Source-to-sale tracking, so you know which channel produced which customer.",
      },
    ],
    faqs: [
      {
        question: "How quickly will I see leads?",
        answer:
          "Most campaigns produce their first leads within days of launch. Meaningful optimisation takes 4–8 weeks of data. We're upfront about this: month one is about building signal, not final performance.",
      },
      {
        question: "Do you guarantee a number of leads?",
        answer:
          "No, and we'd be cautious of anyone who does before understanding your market. What we do guarantee is full transparency: you'll see exactly what's spent, what it produced, and what we're changing.",
      },
      {
        question: "Who owns the ad accounts and data?",
        answer:
          "You do. Ad accounts, pixels, CRM data and landing pages are set up in your name. If we part ways, everything stays with you.",
      },
      {
        question: "What budget do I need?",
        answer:
          "It depends on your industry and area, but most clients start with a combined ad spend and management budget from around £1,500–£3,000 per month. We'll give you a specific recommendation on the consultation call.",
      },
      {
        question: "Do you work with my industry?",
        answer:
          "We focus on UK service businesses: estate agents, dentists, solicitors, mortgage brokers, clinics, trades and home improvement companies. If your customers search for or respond to offers online, the model applies.",
      },
    ],
  },
  {
    slug: "meta-advertising",
    name: "Meta Advertising",
    shortDescription:
      "Facebook and Instagram campaigns built for leads and appointments — creative, targeting, retargeting and conversion tracking managed properly.",
    overviewList: [
      "Facebook & Instagram ads",
      "Lead generation campaigns",
      "Appointment campaigns",
      "Retargeting audiences",
      "Pixel & Conversions API setup",
    ],
    seoTitle: "Meta Ads Agency UK | Facebook & Instagram Advertising | Verique",
    seoDescription:
      "Facebook and Instagram advertising for UK businesses. Lead generation campaigns, appointment campaigns, retargeting and conversion tracking. Managed by Verique.",
    h1: "Facebook & Instagram ads that produce enquiries, not just impressions.",
    lede: "Meta is still the most powerful way to put an offer in front of local customers before they start searching. We run lead and appointment campaigns with proper tracking, so every pound is accountable.",
    featuresEyebrow: "What's included",
    featuresHeading: "Full-service Meta advertising",
    features: [
      {
        title: "Facebook Ads",
        description:
          "Campaigns built for your objective — leads, appointments, calls or sales — with creative and copy made for your audience, not recycled templates.",
      },
      {
        title: "Instagram Ads",
        description:
          "Feed, Stories and Reels placements that reach your customers where they actually spend time, with creative formatted properly for each.",
      },
      {
        title: "Lead generation campaigns",
        description:
          "Instant forms and landing-page funnels with qualifying questions, connected directly to your CRM so leads are contacted while they're still warm.",
      },
      {
        title: "Appointment campaigns",
        description:
          "Campaigns built around booked calls and consultations rather than raw form fills — ideal for dentists, brokers, solicitors and clinics.",
      },
      {
        title: "Retargeting",
        description:
          "Structured retargeting for site visitors, video viewers and past enquiries. The cheapest conversions you'll ever buy, done properly.",
      },
      {
        title: "Conversion tracking",
        description:
          "Pixel, Conversions API and offline conversion uploads configured correctly, so Meta optimises toward customers — not just clicks.",
      },
    ],
    stepsEyebrow: "How it works",
    stepsHeading: "How we run Meta accounts",
    steps: [
      {
        title: "Account & tracking audit",
        description:
          "We audit your pixel, past campaigns and account structure (or set them up from scratch), fixing tracking before spending a pound.",
      },
      {
        title: "Offer & creative strategy",
        description:
          "We define the hook: the offer, angle and creative formats most likely to stop your customer mid-scroll. You approve everything before launch.",
      },
      {
        title: "Structured launch",
        description:
          "Campaigns launch with clean structure and controlled budgets, testing audiences and creative in a way that produces readable data.",
      },
      {
        title: "Weekly optimisation",
        description:
          "Budget moves toward what converts. Fatigued creative is refreshed, losing ads are cut, and lead quality feedback from your team shapes targeting.",
      },
      {
        title: "Scale & expand",
        description:
          "Winning campaigns scale vertically and horizontally — higher budgets, new audiences, new offers — while cost per result is monitored daily.",
      },
    ],
    outcomesHeading: "What good Meta management delivers",
    outcomes: [
      {
        title: "Lower cost per lead over time",
        description: "Systematic testing compounds: each month's data makes the next month's targeting sharper.",
      },
      {
        title: "Creative that doesn't go stale",
        description: "A refresh cycle keeps performance stable instead of cliff-dropping when ads fatigue.",
      },
      {
        title: "Attribution you can trust",
        description: "With CAPI and offline conversions wired up, you'll know which ads produced actual customers.",
      },
    ],
    faqs: [
      {
        question: "Do Meta ads still work for local businesses?",
        answer:
          "Yes — often better than anything else, because you can reach ideal customers before competitors do. The difference between 'we tried Facebook ads' and results is almost always offer, tracking and management.",
      },
      {
        question: "Do you create the ad creative?",
        answer:
          "Yes. Copy, image direction and video scripts are included. If you have a videographer we'll direct them; if not, we'll work with what you have and our video marketing service.",
      },
      {
        question: "What's a realistic budget?",
        answer:
          "Most local campaigns need £30–£70 per day in ad spend to generate consistent data and results. We'll recommend a figure for your market on the consultation call.",
      },
      {
        question: "How do you handle lead quality complaints?",
        answer:
          "Head on. Your team's feedback is a weekly input: we adjust qualifying questions, audiences and offers until 'lead' means someone worth your time.",
      },
    ],
  },
  {
    slug: "google-advertising",
    name: "Google Advertising",
    shortDescription:
      "High-intent search campaigns that capture customers already looking for what you do — with negative keyword discipline and dedicated landing pages.",
    overviewList: [
      "Search ads on buying-intent keywords",
      "Local lead generation",
      "Call & form conversion tracking",
      "Landing pages per campaign",
      "Transparent search-term reporting",
    ],
    seoTitle: "Google Ads Agency UK | Search Ads & Local Lead Generation | Verique",
    seoDescription:
      "Google Ads management for UK businesses. High-intent search campaigns, local lead generation, conversion tracking and dedicated landing pages. Managed by Verique.",
    h1: "Be the answer when customers are already searching.",
    lede: "Google captures demand at its peak: someone typing 'emergency dentist near me' is ready to book today. We build search campaigns around high-intent keywords and send that traffic to pages built to convert it.",
    featuresEyebrow: "What's included",
    featuresHeading: "Search-led, intent-first",
    features: [
      {
        title: "Search Ads",
        description:
          "Tightly themed campaigns on the searches that signal buying intent in your market — written, structured and bid-managed by people, informed by data.",
      },
      {
        title: "Local lead generation",
        description:
          "Location targeting, local ad copy and call extensions tuned for businesses that serve a defined area. You pay for your patch, not the whole country.",
      },
      {
        title: "High-intent keywords",
        description:
          "We prioritise 'ready now' searches over vanity volume, and maintain aggressive negative keyword lists so budget isn't burned on browsers and bargain hunters.",
      },
      {
        title: "Conversion tracking",
        description:
          "Calls, forms and bookings tracked properly — including call recording where useful — so bids optimise toward enquiries, not clicks.",
      },
      {
        title: "Dedicated landing pages",
        description:
          "Search traffic goes to fast, message-matched landing pages built for the keyword, not a homepage that makes visitors hunt for the phone number.",
      },
      {
        title: "Transparent reporting",
        description: "Search terms, costs and conversions visible at all times. You'll never wonder where the budget went.",
      },
    ],
    stepsEyebrow: "How it works",
    stepsHeading: "How we build Google accounts",
    steps: [
      {
        title: "Keyword & competitor research",
        description:
          "We map what your customers actually search, what it costs, and what competitors are doing — and give you an honest read on the opportunity.",
      },
      {
        title: "Account build",
        description:
          "Campaigns, ad groups, ads, extensions, audiences and negative lists built cleanly. If you have an existing account, we restructure rather than rip out what's working.",
      },
      {
        title: "Landing pages & tracking",
        description: "Conversion tracking configured and landing pages matched to each campaign theme before launch.",
      },
      {
        title: "Launch & calibrate",
        description:
          "Controlled launch with daily monitoring in the first weeks: search term reviews, bid adjustments and budget pacing.",
      },
      {
        title: "Ongoing optimisation",
        description:
          "Weekly optimisation cycles — queries, ads, bids, pages — compounding toward a lower cost per enquiry every month.",
      },
    ],
    outcomesHeading: "What disciplined Google Ads gets you",
    outcomes: [
      {
        title: "Enquiries with intent",
        description: "Leads from search convert faster because they came looking for you, not the other way round.",
      },
      {
        title: "Wasted spend cut",
        description: "Negative keywords and query mining stop your budget subsidising irrelevant clicks.",
      },
      {
        title: "A defensible position",
        description: "Owning the top of your local search results makes every competitor's life harder.",
      },
    ],
    faqs: [
      {
        question: "Google Ads or Meta Ads — which should I run?",
        answer:
          "Google captures existing demand; Meta creates it. High-urgency services (emergency trades, dentists) usually start with Google. Offer-led businesses often start with Meta. Many clients end up running both — we'll tell you honestly which fits your situation first.",
      },
      {
        question: "I've tried Google Ads and it didn't work.",
        answer:
          "Common, and usually diagnosable: broad keywords, no negatives, traffic sent to a homepage, or conversion tracking measuring nothing. We'll audit what happened before recommending anything.",
      },
      {
        question: "How long until it's profitable?",
        answer:
          "Search campaigns can produce enquiries in the first week. Efficiency improves over 2–3 months as query data accumulates. We report honestly throughout so you can see the trajectory.",
      },
      {
        question: "Do I keep the account if we stop working together?",
        answer: "Yes. The account, its history and all data are yours, always.",
      },
    ],
  },
  {
    slug: "video-marketing",
    name: "Video Marketing",
    shortDescription:
      "AI avatar videos, promos, Reels and explainers produced in volume — the creative pipeline that keeps your ads and channels performing.",
    overviewList: [
      "AI avatar & presenter videos",
      "Promotional & offer videos",
      "Reels & short-form content",
      "Business explainer videos",
      "Ad creative refresh pipelines",
    ],
    seoTitle: "Video Marketing Agency UK | AI Video, Reels & Promo Videos | Verique",
    seoDescription:
      "Video marketing for UK businesses: AI avatar videos, promotional videos, Reels, short-form content and explainer videos that feed your ad campaigns and social channels.",
    h1: "Video that sells, produced at the speed your marketing needs.",
    lede: "Video is the highest-performing creative format on every platform that matters. We produce it in volume — from AI-assisted production to promotional and explainer videos — built to feed your ads and social channels, not sit on a showreel.",
    featuresEyebrow: "What's included",
    featuresHeading: "Every format your channels need",
    features: [
      {
        title: "AI avatar videos",
        description:
          "Professional presenter-led videos produced with AI avatars — ideal for offers, updates and ad variations at a fraction of traditional production cost and turnaround.",
      },
      {
        title: "Promotional videos",
        description:
          "Polished promos for your business, offers and services — scripted, edited and formatted for ads, your website and social.",
      },
      {
        title: "Reels & short-form content",
        description:
          "Platform-native short videos for Instagram, Facebook and TikTok, hooked in the first two seconds and captioned for sound-off viewing.",
      },
      {
        title: "Business explainer videos",
        description:
          "Clear, concise explainers that walk prospects through what you do and why it matters — perfect for service businesses with anything to demystify.",
      },
      {
        title: "Ad creative pipelines",
        description: "Batches of video variations for Meta and Google campaigns, so your ads never fatigue without a replacement ready.",
      },
      {
        title: "Scripting & strategy",
        description: "Every video starts with a script written to sell: hook, proof, offer, call to action. Pretty is optional; persuasive isn't.",
      },
    ],
    stepsEyebrow: "How it works",
    stepsHeading: "From brief to published",
    steps: [
      {
        title: "Message & angle",
        description: "We define who the video is for, the one thing it must communicate, and where it will run. Format follows purpose.",
      },
      {
        title: "Script & storyboard",
        description: "You get scripts to approve before anything is produced. Revisions happen here, where they're cheap.",
      },
      {
        title: "Production",
        description:
          "AI-assisted or edited from your footage and assets — whichever the job calls for. Branded, captioned, and formatted per platform.",
      },
      {
        title: "Deploy & measure",
        description: "Videos go live in your campaigns and channels. We track watch time, engagement and — where they run as ads — cost per result.",
      },
      {
        title: "Iterate",
        description: "Winning hooks and formats get doubled down on. The pipeline keeps your channels and campaigns continuously fed.",
      },
    ],
    outcomesHeading: "Why video-first creative wins",
    outcomes: [
      {
        title: "Cheaper attention",
        description: "Video consistently earns lower cost per click and per lead than static creative in competitive markets.",
      },
      {
        title: "Faster trust",
        description: "Prospects who've watched you explain something arrive at the call already half-convinced.",
      },
      {
        title: "Volume without burnout",
        description: "A production pipeline means fresh creative every month without you becoming a full-time content creator.",
      },
    ],
    faqs: [
      {
        question: "Are AI videos actually good enough to use?",
        answer:
          "For direct-response ads, offers and informational content — yes, and improving monthly. For brand films, traditional production still wins. We'll recommend the right tool per job, not push one because it's trendy.",
      },
      {
        question: "Do I need to appear on camera?",
        answer:
          "No. AI avatars, voiceover-led edits and motion graphics all work without you on screen. If you're willing to appear, founder-led video typically outperforms — we'll make it painless.",
      },
      {
        question: "How many videos do I get?",
        answer: "Packages are built around your channels and campaigns, typically 4–12 videos per month. We'll scope it on the consultation call.",
      },
      {
        question: "Can you just edit footage we already have?",
        answer: "Yes. Existing footage, testimonials and phone clips can be cut into high-performing short-form content.",
      },
    ],
  },
  {
    slug: "website-design",
    name: "Website Design",
    shortDescription:
      "Websites and landing pages engineered to convert: mobile-first, fast-loading, and built around lead capture rather than decoration.",
    overviewList: [
      "Lead-generating business websites",
      "Campaign landing pages",
      "Mobile & speed optimisation",
      "Booking & CRM integrations",
      "Post-launch conversion optimisation",
    ],
    seoTitle: "Website Design Agency UK | Lead-Generating Websites & Landing Pages | Verique",
    seoDescription:
      "Websites and landing pages built to convert: fast, mobile-optimised, lead-capture-first web design for UK businesses by Verique.",
    h1: "Websites built to capture leads, not just look the part.",
    lede: "Most business websites are brochures. Yours should be a salesperson: fast, clear, mobile-first, and engineered to turn visitors into enquiries. That's the only kind we build.",
    featuresEyebrow: "What's included",
    featuresHeading: "Built for conversion from line one",
    features: [
      {
        title: "Business websites",
        description:
          "Complete websites with clear messaging, strong calls to action and lead capture on every key page — designed around how your customers actually decide.",
      },
      {
        title: "Landing pages",
        description:
          "Single-purpose pages for campaigns and offers, message-matched to your ads. The difference between a 2% and a 10% conversion rate usually lives here.",
      },
      {
        title: "Lead capture systems",
        description: "Forms, click-to-call, booking calendars and chat — positioned where visitors are ready to act, connected straight to your CRM.",
      },
      {
        title: "Mobile optimisation",
        description: "Designed mobile-first, because that's where most of your traffic is. Thumb-friendly, legible, and quick to the point.",
      },
      {
        title: "Speed optimisation",
        description:
          "Lean builds that load fast on real phones on real networks. Speed is a ranking factor, a conversion factor, and a respect-for-your-visitor factor.",
      },
      {
        title: "Conversion optimisation",
        description: "Heatmaps, session data and structured changes after launch. A website is a system to improve, not a project to finish.",
      },
    ],
    stepsEyebrow: "How it works",
    stepsHeading: "How a build runs",
    steps: [
      {
        title: "Strategy & structure",
        description: "We define the site's job, map the pages to your customer's decision process, and agree the conversion points before any design.",
      },
      {
        title: "Copy & design",
        description: "Messaging written first, design built around it. You review real pages with real words — never lorem ipsum.",
      },
      {
        title: "Build & integrate",
        description: "Fast, responsive build with analytics, tracking, CRM and booking integrations configured properly from day one.",
      },
      {
        title: "Launch",
        description: "Tested across devices, redirects handled, tracking verified. Launch day is boring — that's the point.",
      },
      {
        title: "Improve",
        description: "Post-launch, we watch how real visitors behave and optimise the pages that matter most to your pipeline.",
      },
    ],
    outcomesHeading: "What the right website changes",
    outcomes: [
      {
        title: "More enquiries from the same traffic",
        description: "Conversion-first structure means every visit you already get works harder.",
      },
      {
        title: "Ads that perform better",
        description: "Message-matched pages lower your cost per lead across every paid channel.",
      },
      {
        title: "A site you're proud to send people to",
        description: "Premium, modern, and unmistakably yours — without the agency price tag padding.",
      },
    ],
    faqs: [
      {
        question: "How long does a website take?",
        answer: "Landing pages: 1–2 weeks. Full business websites: typically 3–6 weeks depending on scope. We'll give you a fixed timeline in the proposal.",
      },
      {
        question: "Do you write the content?",
        answer: "Yes. Conversion copywriting is included — it's most of what makes the difference. We'll interview you for the raw material.",
      },
      {
        question: "Can you work with my existing website?",
        answer: "Often, yes. If the platform is sound we'll rework structure, copy and conversion points. If it's holding you back, we'll say so and quote a rebuild.",
      },
      {
        question: "Will I be able to edit it myself?",
        answer: "Yes — builds are handed over with training, and you own everything: domain, hosting, files and content.",
      },
    ],
  },
];

export const crmService = {
  name: "CRM & Automation",
  shortDescription:
    "The follow-up layer most businesses are missing: instant lead routing, automated sequences and pipeline visibility, so no enquiry goes cold.",
  overviewList: [
    "CRM setup & pipeline design",
    "Instant lead notifications",
    "Automated follow-up sequences",
    "Appointment reminders",
    "Source-to-sale reporting",
  ],
};

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
