/**
 * One entry per service. `key` is the section anchor, the `solutionHref` target and
 * the blog tag. Optional: `malls` (EC), `flow` (Sales), `callout` (Marketing, Video).
 * This is the detailed OS-tab copy; the homepage cards carry their own shorter text.
 * Kept free of JSX so tests can check the keys against SERVICE_KEYS.
 */
export const SERVICES = [
  {
    key: "ec",
    icon: "bi-cart3",
    name: "EC Operations Support",
    catch: "Supporting your online stores, day to day.",
    body: [
      "Running an online marketplace store generates a steady stream of daily work: product listings, image editing, inventory and price management, review checks, campaign setup, data aggregation and more.",
      "Wa+Craft supports a wide range of this e-commerce work, lightening the load on your e-commerce staff and helping you build a stable operation.",
      "We also produce short promotional videos and coordinate with digital marketing, flexibly supporting everything your e-commerce business needs, from daily operations to sales promotion.",
    ],
    groups: [
      {
        title: "What we handle",
        items: [
          { title: "Product listings and updates", text: "Support with registering product information, writing descriptions, editing images and more." },
          { title: "Inventory and pricing", text: "Support with checking and updating stock levels and prices." },
          { title: "Review management", text: "Support with daily management such as checking and organizing reviews." },
          { title: "Campaign setup", text: "Support with the settings and updates needed for sales and campaigns." },
          { title: "Data aggregation and reports", text: "We organize and aggregate data on sales and store performance." },
          { title: "Short promotional videos", text: "We produce short videos for e-commerce products and social media." },
        ],
      },
    ],
    malls: {
      title: "Supported marketplaces",
      items: ["Rakuten", "Amazon", "Yahoo! Shopping", "LINE Shopping"],
    },
    points: [
      {
        title: "A Japanese-speaking e-commerce team",
        text: "We communicate with you directly in Japanese, so instructions, checks and reports run smoothly.",
      },
      {
        title: "One-stop support from operations to customer acquisition",
        text: "From product listings and image production to SEO, social media and video, we handle e-commerce operations and related work together.",
      },
      {
        title: "High quality × cost efficiency",
        text: "We work to the quality standards Japanese companies expect while optimizing costs through an efficient operating setup.",
      },
      {
        title: "Fast start-up",
        text: "We sort out the work and resources you need and help you get up and running smoothly.",
      },
      {
        title: "Data-driven improvement",
        text: "We organize and analyze reports and store data to make issues visible and drive improvement.",
      },
      {
        title: "A stable operating setup",
        text: "Drawing on Vietnamese talent, we build an operation that can respond continuously and flexibly.",
      },
    ],
  },
  {
    key: "bpo",
    icon: "bi-diagram-3",
    name: "Business Process Outsourcing",
    catch: "Make everyday work more efficient.",
    body: [
      "Every company\u2019s daily operations involve a steady flow of routine tasks such as data entry, data processing, electronic document management and system updates.",
      "Wa+Craft supports this work in line with your existing workflows.",
      "And rather than simply doing the work for you, we organize your workflows and explore where IT tools and automation can help, supporting a more efficient operation.",
    ],
    groups: [
      {
        title: "What we handle",
        items: [
          { title: "Data entry and processing", text: "Support with entering, checking, organizing and aggregating data." },
          { title: "Electronic document management", text: "Support with organizing and managing digital data and documents." },
          { title: "System updates", text: "We handle routine work such as registering and updating information in your systems." },
          { title: "Workflow mapping", text: "We map how your work currently flows and look for places to make it more efficient." },
          { title: "IT tools", text: "We look at how IT tools can be used to fit the work." },
          { title: "Automation", text: "We help make work more efficient by automating repetitive tasks." },
        ],
      },
    ],
    points: [
      { title: "People × IT", text: "We combine people\u2019s judgment with IT to run operations efficiently." },
      { title: "Process improvement", text: "We don\u2019t just do the work we\u2019re given; we think about better ways to do it." },
      { title: "Continuous improvement", text: "We review issues as we go and make improvements where needed." },
    ],
  },
  {
    key: "marketing",
    icon: "bi-megaphone",
    name: "Digital Marketing Support",
    catch: "Digital tools that bring in customers.",
    body: [
      "We support marketing that uses digital channels such as your website, search engines and social media.",
      "From SEO keyword research and content production to social media management, website and landing page updates and improvements, and traffic analysis, you can use just the services that fit your goals.",
      "We also work together with e-commerce operations and video production to support marketing that connects customer acquisition all the way to sales promotion.",
    ],
    groups: [
      {
        title: "What we handle",
        items: [
          { title: "SEO keyword research", text: "We research the keywords your target users search for." },
          { title: "SEO", text: "We help improve your website with search traffic in mind." },
          { title: "Article outlines and content production", text: "Support with outlining SEO articles and producing content." },
          { title: "Social media management", text: "We help run accounts on Instagram, Facebook, X, TikTok and more." },
          { title: "Website updates", text: "We handle updates to web page information and content." },
          { title: "Landing page improvement proposals", text: "We propose landing page improvements based on user behavior and goals." },
          { title: "Traffic analysis and reports", text: "We organize and analyze traffic data and report on performance." },
        ],
      },
    ],
    callout: {
      label: "EC × Marketing",
      title: "Connecting e-commerce operations and marketing.",
      text: "We feed what e-commerce operations reveal, insights and issues alike, into marketing, and support sales promotion that combines SEO, social media, content and more.",
    },
    points: [
      {
        title: "End-to-end SEO support",
        text: "From keyword research to article outlines, content production and on-page SEO, we handle the work SEO requires.",
      },
      {
        title: "A wide range of content",
        text: "We help produce SEO articles, web content, social posts, video content and more, matched to your goals.",
      },
      {
        title: "Social media marketing",
        text: "Through social posting and content production, we help raise awareness and win customers.",
      },
      {
        title: "Website and landing page improvement",
        text: "Through updates and improvements to your website and landing pages, we help build pages that are clear to users and deliver results.",
      },
      {
        title: "Data analysis and measurement",
        text: "We organize and analyze traffic data and campaign results, making visible the information that drives future improvement.",
      },
      {
        title: "EC × Marketing",
        text: "We combine e-commerce operations with SEO, social media and content production to bring in customers and promote sales of your products.",
      },
    ],
  },
  {
    key: "video",
    icon: "bi-camera-video",
    name: "Video Production Support",
    catch: "Turning what you want to say into video.",
    body: [
      "In e-commerce sales and social media marketing, video is one of the most important ways to convey a product\u2019s features and appeal in a short time.",
      "Our video production service supports product videos, social media ad videos, and short-form videos for TikTok, Instagram Reels, YouTube Shorts and more.",
      "From planning and structure to editing, subtitles and captions, we produce videos matched to your goals and the platforms where they will run.",
    ],
    groups: [
      {
        title: "Videos we make",
        items: [
          { title: "Product videos", text: "Videos that clearly convey a product\u2019s features and appeal." },
          { title: "Social media ad videos", text: "Short videos that show a product\u2019s appeal on social media and spark interest." },
          { title: "Short-form videos", text: "Videos made for TikTok, Instagram Reels, YouTube Shorts and more." },
        ],
      },
      {
        title: "What we produce",
        items: [
          { title: "Planning and structure", text: "We set the direction of the video around your goals and target audience." },
          { title: "Video editing", text: "We edit your footage into a video that fits its purpose." },
          { title: "Subtitles and captions", text: "We add subtitles and captions that make the content easy to follow." },
          { title: "Revisions and adjustments", text: "We revise and adjust based on your review." },
        ],
      },
    ],
    callout: {
      label: "EC × Video",
      title: "Show your products\u2019 appeal better, with video.",
      text: "Video makes clear the features and use cases that product images and descriptions alone struggle to convey.",
    },
    points: [
      {
        title: "Video for e-commerce and social media",
        text: "We support video production matched to your goals, whether e-commerce sales or social media marketing.",
      },
      {
        title: "Planning with the Japanese market in mind",
        text: "We propose video concepts that fit your goals, with Japanese users and social media trends in mind.",
      },
      {
        title: "From planning to editing",
        text: "We support the whole production process, from planning and structure to editing, subtitles and captions.",
      },
      {
        title: "AI-assisted video production",
        text: "We also use AI and other digital technologies to produce social media videos efficiently.",
      },
      {
        title: "Made to drive sales",
        text: "We aim beyond view counts, for videos that lead to clicks, interest in the product and purchases.",
      },
      {
        title: "Japanese support and cost efficiency",
        text: "We handle requests and revisions in Japanese and keep production efficient.",
      },
    ],
  },
  {
    key: "sales",
    icon: "bi-person-lines-fill",
    name: "Sales & CRM Support",
    catch: "Make your sales activities run more smoothly.",
    body: [
      "Sales involves a lot of work: researching prospects, building customer lists, sales emails, scheduling appointments, following up with customers, updating the CRM and more. We support a wide range of this sales work.",
      "By handing us routine tasks and sales administration, your sales team can focus on more important work such as negotiations and building customer relationships.",
    ],
    groups: [
      {
        title: "What we handle",
        items: [
          { title: "Prospect research and sourcing", text: "We research and identify target companies and prospects." },
          { title: "Customer lists", text: "We organize and manage the customer information your sales team needs." },
          { title: "Sales emails", text: "Support with sending emails to prospects." },
          { title: "Meeting appointments", text: "Support with scheduling and setting appointments with customers." },
          { title: "Follow-up and nurturing", text: "Support with ongoing follow-up such as replying to emails and checking responses." },
          { title: "CRM management", text: "We organize and update customer information and deal progress." },
        ],
      },
    ],
    flow: {
      title: "How our sales support works",
      steps: [
        "Research and sourcing",
        "Customer list",
        "Sales email",
        "Response check",
        "Appointment setting",
        "Customer follow-up",
        "CRM update",
      ],
    },
    points: [
      {
        title: "End-to-end lead generation",
        text: "From researching and identifying prospects to first contact, we support the early stages of your sales process.",
      },
      {
        title: "One-stop sales process support",
        text: "We handle customer lists, email outreach, appointment setting, follow-up and CRM management.",
      },
      {
        title: "More efficient sales",
        text: "We take on routine sales tasks and administration so your sales team can focus on negotiations and closing.",
      },
      {
        title: "Data-driven sales support",
        text: "We organize customer and sales activity data so you can see where your sales stand.",
      },
      {
        title: "Optimized CRM operations",
        text: "We organize and update customer and deal information, helping you see and manage your sales activities.",
      },
      {
        title: "Ongoing customer follow-up",
        text: "We support continuous follow-up with prospects, helping create new sales opportunities.",
      },
    ],
  },
];
