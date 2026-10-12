export interface Participation {
  icon: "eye" | "bar" | "star";
  text: {
    es: string;
    en: string;
  };
}

export interface ProjectImage {
  src: string;
  alt: string;
  aspect?: "wide" | "tall" | "square";
  cta?: {
    label: {
      es: string;
      en: string;
    };
    href: string;
  };
}

export interface PortfolioProject {
  slug: string;
  title: string;
  folder: string;
  subtitle: {
    es: string;
    en: string;
  };
  industry: {
    es: string;
    en: string;
  };
  role: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  strategy?: {
    es: string;
    en: string;
  };
  previewImages: [string, string, string];
  images: ProjectImage[];
  participation?: Participation[];
}

export const portfolioProjects: Record<string, PortfolioProject> = {
  miiles: {
    slug: "miiles",
    title: "Miiles AI",
    folder: "Miiles",
    subtitle: {
      es: "Plataforma de gestión de talento y reclutamiento inteligente.",
      en: "Smart talent management and recruitment platform.",
    },
    industry: {
      es: "Inteligencia Artificial y Consultoría de Ventas",
      en: "Artificial Intelligence & Sales Consulting",
    },
    role: {
      es: "Embudos de Ventas, Estrategia de Identidad de Marca y Automatización con IA",
      en: "Sales Funnels, Brand Identity Strategy & AI Automation",
    },
    description: {
      es: "Lideramos la creación y escalamiento de la marca mediante soluciones de prospección en frío y embudos de alta conversión impulsados por agentes de IA conversacional. Desarrollamos la identidad visual completa, la arquitectura de ventas y las estrategias de crecimiento multicanal para posicionar a Miiles como referente en automatización comercial.",
      en: "We led the brand's creation and scaling through cold outreach solutions and high-conversion funnels powered by conversational AI agents. We developed the complete visual identity, sales architecture, and multi-channel growth strategies to position Miiles as a leader in commercial automation.",
    },
    previewImages: [
      "portada-1.webp",
      "about-miiles.webp",
      "mockup-app-web.webp",
    ],
    images: [
      { src: "portada-1.webp", alt: "Miiles — Cover", aspect: "wide" },
      {
        src: "mockup-miiles-app.jpg",
        alt: "Miiles — Home de miiles.app en un monitor",
        aspect: "wide",
        cta: {
          label: { es: "Ver página", en: "View site" },
          href: "https://miiles.app/",
        },
      },
      { src: "about-miiles.webp", alt: "Miiles — About", aspect: "wide" },
      { src: "logo.webp", alt: "Miiles — Logo", aspect: "wide" },
      { src: "isotipo.webp", alt: "Miiles — Isotipo", aspect: "wide" },
      { src: "elementos-visuales.webp", alt: "Miiles — Visual Elements", aspect: "wide" },
      { src: "iconos.webp", alt: "Miiles — Iconography", aspect: "wide" },
      { src: "mockup-app-web.webp", alt: "Miiles — Web App Mockup", aspect: "wide" },
      { src: "elementos-visuales-y-mockups-de-la-app-web.webp", alt: "Miiles — Visual Elements & Mockups", aspect: "wide" },
    ],
    participation: [
      { icon: "bar", text: { es: "Embudos de Ventas", en: "Sales Funnels" } },
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
      { icon: "eye", text: { es: "Automatización con IA", en: "AI Automation" } },
    ],
  },

  "tapp-telcel": {
    slug: "tapp-telcel",
    title: "Tapp Telcel",
    folder: "tapp-telcel",
    subtitle: {
      es: "Diseño UI y UX integral para onboarding, adquisición de eSIM y gestión de línea.",
      en: "Comprehensive UI and UX design for onboarding, eSIM acquisition, and line management.",
    },
    industry: {
      es: "Telecomunicaciones / App Móvil",
      en: "Telecommunications / Mobile App",
    },
    role: {
      es: "Diseño UI/UX",
      en: "UI/UX Design",
    },
    description: {
      es: "Tapp Telcel es la nueva app de Telcel que te permite obtener un eSIM y gestionar tu línea. Una experiencia desafiante en la que nos enfocamos en diseñar el UI y UX de todo el onboarding, la adquisición de eSIM y la compra de paquetes. Desarrollamos todo el diseño visual en Figma, incluyendo animaciones e íconos, y trabajamos de la mano con desarrolladores para su correcta ejecución, además de presentar los mockups a nivel ejecutivo.",
      en: "Tapp Telcel is Telcel's new app that lets you get an eSIM and manage your line. A challenging experience where we focused on designing the UI and UX for the entire onboarding, eSIM acquisition, and package purchasing. We developed all the visual design in Figma, including animations and icons, working closely with developers for proper execution, and presented the mockups at an executive level.",
    },
    previewImages: [
      "Portada.webp",
      "Mini-1.webp",
      "Mini-2.webp",
    ],
    images: [
      { src: "Portada.webp", alt: "Tapp Telcel — Cover", aspect: "wide" },
      { src: "1.webp", alt: "Tapp Telcel — 1", aspect: "wide" },
      { src: "2.webp", alt: "Tapp Telcel — 2", aspect: "wide" },
      { src: "3.webp", alt: "Tapp Telcel — 3", aspect: "wide" },
      { src: "5.webp", alt: "Tapp Telcel — 5", aspect: "wide" },
      { src: "4.webp", alt: "Tapp Telcel — 4", aspect: "wide" },
      { src: "6.webp", alt: "Tapp Telcel — 6", aspect: "wide" },
      { src: "7.mp4", alt: "Tapp Telcel — Video", aspect: "wide" },
      { src: "8.webp", alt: "Tapp Telcel — 8", aspect: "wide" },
      { src: "9.webp", alt: "Tapp Telcel — 9", aspect: "wide" },
      { src: "10.webp", alt: "Tapp Telcel — 10", aspect: "wide" },
    ],
    participation: [
      { icon: "star", text: { es: "Diseño UI/UX", en: "UI/UX Design" } },
      { icon: "eye", text: { es: "Animaciones y Prototipado", en: "Animations & Prototyping" } },
    ],
  },

  "naabi-kanabi": {
    slug: "naabi-kanabi",
    title: "Naabi Kanabi",
    folder: "Naabi-Kanabi",
    subtitle: {
      es: "Diseño de experiencia y branding para productos de bienestar natural.",
      en: "Experience design and branding for natural wellness products.",
    },
    industry: {
      es: "Skincare y Dermocosmética",
      en: "Skincare & Dermocosmetics",
    },
    role: {
      es: "Embudos de Ventas, Estrategia de Identidad de Marca y Automatización con IA",
      en: "Sales Funnels, Brand Identity Strategy & AI Automation",
    },
    description: {
      es: "Ejecutamos el lanzamiento integral de la marca con una tienda en Shopify y agentes de IA conversacional para asesoría dermocosmética y cierre de ventas. Fortalecimos su presencia con una narrativa visual limpia, campañas de contenido estratégico y una conexión fluida entre el canal físico y digital.",
      en: "We executed the comprehensive brand launch with a Shopify store and conversational AI agents for skincare consultation and automated sales closing. We strengthened its presence with a clean visual narrative, strategic content campaigns, and seamless alignment between physical and digital channels.",
    },
    previewImages: [
      "portada-v2.webp",
      "naabi-1.webp",
      "naabi-2.webp",
    ],
    images: [
      { src: "portada-v2.webp", alt: "Naabi Kanabi — Cover", aspect: "wide" },
      {
        src: "nk-7-v2.webp",
        alt: "Naabi Kanabi — Diagnóstico facial en tablet",
        aspect: "wide",
        cta: {
          label: { es: "Ver página", en: "View site" },
          href: "https://naabikanabi.com/",
        },
      },
      { src: "nk-1.webp", alt: "Naabi Kanabi — Detail 1", aspect: "wide" },
      { src: "nk-3.webp", alt: "Naabi Kanabi — Detail 3", aspect: "wide" },
      { src: "nk-4.webp", alt: "Naabi Kanabi — Detail 4", aspect: "wide" },
      { src: "nk-5.webp", alt: "Naabi Kanabi — Detail 5", aspect: "wide" },
      { src: "nk-6.webp", alt: "Naabi Kanabi — Detail 6", aspect: "wide" },
      { src: "nk-8.webp", alt: "Naabi Kanabi — Detail 8", aspect: "wide" },
      { src: "nk-9.webp", alt: "Naabi Kanabi — Detail 9", aspect: "wide" },
      { src: "nk-10.webp", alt: "Naabi Kanabi — Detail 10", aspect: "wide" },
      { src: "nk-11.webp", alt: "Naabi Kanabi — Detail 11", aspect: "wide" },
    ],
    participation: [
      { icon: "bar", text: { es: "Embudos de Ventas", en: "Sales Funnels" } },
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
      { icon: "eye", text: { es: "Automatización con IA", en: "AI Automation" } },
    ],
  },

  tulum: {
    slug: "tulum",
    title: "Tulum",
    folder: "Tulum",
    subtitle: {
      es: "Desarrollo de identidad visual y diseño estratégico.",
      en: "Visual identity development and strategic design.",
    },
    industry: {
      es: "Restaurante",
      en: "Restaurant",
    },
    role: {
      es: "Dirección de Arte, Diseño Web y Diseño UI/UX",
      en: "Art Direction, Web Design & UI/UX Design",
    },
    description: {
      es: "Trabajamos en la creación de una identidad visual inmersiva que captura la esencia y la energía del proyecto, desarrollando interfaces modernas y optimizadas para transmitir su propuesta de valor única.",
      en: "We worked on creating an immersive visual identity that captures the project's essence and energy, developing modern, optimized interfaces to convey its unique value proposition.",
    },
    previewImages: [
      "Portada.webp",
      "Mini-1.webp",
      "Mini-2.webp",
    ],
    images: [
      { src: "Portada.webp", alt: "Tulum — Cover", aspect: "wide" },
      {
        src: "1.webp",
        alt: "Tulum — 1",
        aspect: "wide",
        cta: {
          label: { es: "Ver demo", en: "View demo" },
          href: "https://lightblue-wasp-875646.hostingersite.com/",
        },
      },
      { src: "2.webp", alt: "Tulum — 2", aspect: "wide" },
      { src: "3.webp", alt: "Tulum — 3", aspect: "wide" },
      { src: "4.webp", alt: "Tulum — 4", aspect: "wide" },
      { src: "5.webp", alt: "Tulum — 5", aspect: "wide" },
      { src: "6.webp", alt: "Tulum — 6", aspect: "wide" },
      { src: "7.webp", alt: "Tulum — 7", aspect: "wide" },
    ],
    participation: [
      { icon: "star", text: { es: "Dirección de Arte", en: "Art Direction" } },
      { icon: "eye", text: { es: "Diseño Web", en: "Web Design" } },
    ],
  },

  tularosa: {
    slug: "tularosa",
    title: "Tularosa",
    folder: "Tularosa",
    subtitle: {
      es: "Estrategia visual y comunicación para hospitality y gastronomía.",
      en: "Visual strategy and communication for hospitality and gastronomy.",
    },
    industry: {
      es: "Gastronomía y Hospitalidad",
      en: "Gastronomy & Hospitality",
    },
    role: {
      es: "Embudos de Ventas y Estrategia de Identidad de Marca",
      en: "Sales Funnels & Brand Identity Strategy",
    },
    description: {
      es: "Digitalizamos la propuesta gastronómica de Tularosa mediante una plataforma web enfocada en reservas directas y conversión. Refinamos la base visual y realizamos dirección fotográfica profesional para destacar el atractivo visual de sus platillos y maximizar la ocupación del restaurante.",
      en: "We digitized Tularosa's gastronomic offering through a web platform focused on direct bookings and conversion. We refined the visual foundation and conducted professional food photography direction to highlight culinary appeal and maximize restaurant occupancy.",
    },
    previewImages: [
      "portada-1.webp",
      "tula-1.webp",
      "tula-2.webp",
    ],
    images: [
      { src: "portada-1.webp", alt: "Tularosa — Cover", aspect: "wide" },
      { src: "portada-2.webp", alt: "Tularosa — Cover 2", aspect: "wide" },
      { src: "mockup-de-comida.webp", alt: "Tularosa — Food Mockup", aspect: "wide" },
      { src: "frase-publicitaria-1.webp", alt: "Tularosa — Tagline 1", aspect: "wide" },
      { src: "frase-publicitaria-2.webp", alt: "Tularosa — Tagline 2", aspect: "wide" },
      { src: "frase-publicitaria-3.webp", alt: "Tularosa — Tagline 3", aspect: "wide" },
      { src: "publicidad-de-exterior.webp", alt: "Tularosa — Outdoor Advertising", aspect: "wide" },
    ],
    participation: [
      { icon: "bar", text: { es: "Embudos de Ventas", en: "Sales Funnels" } },
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
    ],
  },

  erpxtender: {
    slug: "erpxtender",
    title: "ERPXtender",
    folder: "Erpxtender",
    subtitle: {
      es: "Consultoría de marca y diseño de interfaz para ERP de alto rendimiento.",
      en: "Brand consulting and interface design for high-performance ERP.",
    },
    industry: {
      es: "ERP y Automatización B2B",
      en: "ERP & B2B Automation",
    },
    role: {
      es: "Embudo de Ventas y Estrategia de Identidad de Marca",
      en: "Sales Funnel & Brand Identity Strategy",
    },
    description: {
      es: "Transformamos la identidad y estrategia visual de ERPXtender para posicionarlo como una solución ágil e innovadora en la industria corporativa. Diseñamos una interfaz web centrada en UX y producimos activos visuales de alto impacto optimizados para un embudo de ventas B2B que acelera la toma de decisiones.",
      en: "We transformed ERPXtender's visual identity and strategy to position it as an agile, innovative solution in the corporate industry. We designed a UX-centered web interface and produced high-impact visual assets optimized for a B2B sales funnel that accelerates decision-making.",
    },
    previewImages: [
      "portada-1.webp",
      "elementos-graficos-para-web-y-redes-1.webp",
      "publicidad-exterior.webp",
    ],
    images: [
      { src: "portada-1.webp", alt: "ERPXtender — Cover", aspect: "wide" },
      { src: "logo.webp", alt: "ERPXtender — Logo", aspect: "wide" },
      { src: "frase-publicitaria-1.webp", alt: "ERPXtender — Tagline", aspect: "wide" },
      { src: "elementos-graficos-para-web-y-redes-1.webp", alt: "ERPXtender — Web & Social Assets 1", aspect: "wide" },
      { src: "elementos-graficos-para-web-y-redes-2.webp", alt: "ERPXtender — Web & Social Assets 2", aspect: "wide" },
      { src: "elementos-graficos-para-web-y-redes-3.webp", alt: "ERPXtender — Web & Social Assets 3", aspect: "wide" },
      { src: "publicidad-exterior.webp", alt: "ERPXtender — Outdoor Advertising", aspect: "wide" },
    ],
    participation: [
      { icon: "bar", text: { es: "Embudos de Ventas", en: "Sales Funnels" } },
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
    ],
  },

  "mar-vic": {
    slug: "mar-vic",
    title: "Mar & Vic",
    folder: "Mar-Vic",
    subtitle: {
      es: "Branding sofisticado y ecosistema e-commerce para diseño de interiores.",
      en: "Sophisticated branding and e-commerce ecosystem for interior design.",
    },
    industry: {
      es: "Muebles, Retail y Diseño de Interiores",
      en: "Furniture, Retail & Interior Design",
    },
    role: {
      es: "Embudos de Ventas, Estrategia de Identidad de Marca y Automatización con IA",
      en: "Sales Funnels, Brand Identity Strategy & AI Automation",
    },
    description: {
      es: "Construimos el ecosistema digital y la tienda oficial en Shopify de la marca, implementando flujos automatizados de email marketing y nutrición de clientes. Desarrollamos la identidad visual sofisticada, dirección de arte fotográfica y lineamientos de marca para ofrecer una experiencia de compra premium y memorable.",
      en: "We built the brand's digital ecosystem and official Shopify store, implementing automated email marketing and lead nurturing flows. We developed the sophisticated visual identity, photographic art direction, and brand guidelines to deliver a premium, memorable shopping experience.",
    },
    previewImages: [
      "portada-1.webp",
      "mar-1.webp",
      "mar-2.webp",
    ],
    images: [
      { src: "portada-1.webp", alt: "Mar & Vic — Cover", aspect: "wide" },
      { src: "logotipo.webp", alt: "Mar & Vic — Logo", aspect: "wide" },
      { src: "isotipo.webp", alt: "Mar & Vic — Isotipo", aspect: "wide" },
      { src: "frase-publicitaria-1.webp", alt: "Mar & Vic — Tagline 1", aspect: "wide" },
      { src: "frase-publicitaria-2.webp", alt: "Mar & Vic — Tagline 2", aspect: "wide" },
      { src: "fotos-publicitarias.webp", alt: "Mar & Vic — Photography", aspect: "wide" },
    ],
    participation: [
      { icon: "bar", text: { es: "Embudos de Ventas", en: "Sales Funnels" } },
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
      { icon: "eye", text: { es: "Automatización con IA", en: "AI Automation" } },
    ],
  },

  original: {
    slug: "original",
    title: "Original — Salon de Barbier",
    folder: "Original",
    subtitle: {
      es: "Dirección de arte y diseño web orientado a reservas y conversión.",
      en: "Art direction and web design oriented towards booking and conversion.",
    },
    industry: {
      es: "Barbería y Cuidado Personal Masculino",
      en: "Barbershop & Men's Grooming",
    },
    role: {
      es: "Embudos de Ventas y Estrategia de Identidad de Marca",
      en: "Sales Funnels & Brand Identity Strategy",
    },
    description: {
      es: "Desarrollamos una identidad de marca distintiva y una plataforma web orientada al agendamiento rápido sin fricciones. Mediante dirección fotográfica profesional y un layout de embudo optimizado, transformamos la presencia digital del salón para maximizar la captación y recurrencia de clientes.",
      en: "We developed a distinctive brand identity and a frictionless booking-oriented web platform. Through professional photographic direction and an optimized funnel layout, we transformed the salon's digital presence to maximize client acquisition and retention.",
    },
    previewImages: [
      "portada-1.webp",
      "original-1.webp",
      "original-2.webp",
    ],
    images: [
      { src: "portada-1.webp", alt: "Original — Cover", aspect: "wide" },
      { src: "isotipo.webp", alt: "Original — Isotipo", aspect: "wide" },
      { src: "fotos-instagram.webp", alt: "Original — Instagram", aspect: "wide" },
      { src: "landing-page-1.webp", alt: "Original — Landing Page 1", aspect: "wide" },
      { src: "landing-page-2.webp", alt: "Original — Landing Page 2", aspect: "wide" },
    ],
    participation: [
      { icon: "bar", text: { es: "Embudos de Ventas", en: "Sales Funnels" } },
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
    ],
  },

  "virreinal-tepeyac": {
    slug: "virreinal-tepeyac",
    title: "Virreinal Tepeyac",
    folder: "virreinal-tepeyac",
    subtitle: {
      es: "Construcción de marca y diseño web para un venue boutique de alto calibre.",
      en: "Brand building and web design for a high-caliber boutique venue.",
    },
    industry: {
      es: "Eventos y Venue Boutique",
      en: "Events & Boutique Venue",
    },
    role: {
      es: "Estrategia de Marca y Diseño Web",
      en: "Brand Strategy & Web Design",
    },
    description: {
      es: "Diseñamos toda la estrategia de la marca, construyendo su ADN desde cero a partir de sus valores. Ya contaban con un elemento gráfico cuando los conocimos, el cual integramos como isotipo principal para diseñar una identidad que se sintiera verdaderamente premium y transmitiera su esencia de salón de eventos boutique. El proyecto abarcó desde el manual de identidad y la comunicación en redes sociales hasta la creación de su sitio web (https://virreinaltepeyac.com/).",
      en: "We designed the entire brand strategy, building its DNA from scratch based on their core values. They already had a graphic element when we met them, which we integrated as the main isotype to craft an identity that felt truly premium and conveyed its boutique venue essence. The project ranged from the identity manual and social media communication to the creation of their website (https://virreinaltepeyac.com/).",
    },
    previewImages: [
      "portada.webp",
      "portada-mini-1.webp",
      "portada-mini-2.webp",
    ],
    images: [
      { src: "portada.webp", alt: "Virreinal Tepeyac — Cover", aspect: "wide" },
      { src: "1.webp", alt: "Virreinal Tepeyac — 1", aspect: "wide" },
      { src: "2.webp", alt: "Virreinal Tepeyac — 2", aspect: "wide" },
      { src: "3.webp", alt: "Virreinal Tepeyac — 3", aspect: "wide" },
      { src: "4.webp", alt: "Virreinal Tepeyac — 4", aspect: "wide" },
      { src: "5.webp", alt: "Virreinal Tepeyac — 5", aspect: "wide" },
      { src: "6.webp", alt: "Virreinal Tepeyac — Publicaciones en redes sociales 1", aspect: "wide" },
      { src: "7.webp", alt: "Virreinal Tepeyac — Publicaciones en redes sociales 2", aspect: "wide" },
      { src: "8.webp", alt: "Virreinal Tepeyac — 8", aspect: "wide" },
      { src: "9.webp", alt: "Virreinal Tepeyac — 9", aspect: "wide" },
      { src: "10.webp", alt: "Virreinal Tepeyac — 10", aspect: "wide" },
      { src: "11.webp", alt: "Virreinal Tepeyac — 11", aspect: "wide" },
      { src: "12.webp", alt: "Virreinal Tepeyac — 12", aspect: "wide" },
      { src: "13.webp", alt: "Virreinal Tepeyac — 13", aspect: "wide" },
    ],
    participation: [
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
      { icon: "eye", text: { es: "Diseño Web", en: "Web Design" } },
      { icon: "bar", text: { es: "Estrategia de Redes Sociales", en: "Social Media Strategy" } },
    ],
  },

  colorfit: {
    slug: "colorfit",
    title: "Colorfit",
    folder: "Colorfit",
    subtitle: {
      es: "Identidad visual y branding para marca de moda y fitness contemporánea.",
      en: "Visual identity and branding for contemporary fashion and fitness brand.",
    },
    industry: {
      es: "Fitness, Wellness y Salud",
      en: "Fitness, Wellness & Health",
    },
    role: {
      es: "Estrategia de Identidad de Marca",
      en: "Brand Identity Strategy",
    },
    description: {
      es: "Creamos la identidad visual y lineamientos de marca de Colorfit para proyectar energía y sofisticación en el sector fitness. Diseñamos un sistema gráfico versátil y escalable, adaptado con precisión tanto para su línea textil y merchandising como para sus canales digitales.",
      en: "We created Colorfit's visual identity and brand guidelines to project energy and sophistication in the fitness industry. We designed a versatile, scalable graphic system, precisely tailored for both their apparel line and digital touchpoints.",
    },
    previewImages: [
      "portada-1.webp",
      "colorfit-2.webp",
      "mockup-ropa-2.webp",
    ],
    images: [
      { src: "portada-1.webp", alt: "Colorfit — Cover", aspect: "wide" },
      { src: "diferentes-mockups.webp", alt: "Colorfit — Mockups", aspect: "wide" },
      { src: "mockup-ropa-1.webp", alt: "Colorfit — Apparel Mockup 1", aspect: "wide" },
      { src: "mockup-ropa-2.webp", alt: "Colorfit — Apparel Mockup 2", aspect: "wide" },
      { src: "mockup-tote-bag.webp", alt: "Colorfit — Tote Bag Mockup", aspect: "wide" },
    ],
    participation: [
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
    ],
  },

  jambu: {
    slug: "jambu",
    title: "Jambú",
    folder: "Jambu",
    subtitle: {
      es: "Rediseño de identidad y packaging inspirado en la riqueza natural.",
      en: "Identity and packaging redesign inspired by natural abundance.",
    },
    industry: {
      es: "Alimentos y Consumo Masivo",
      en: "Food & Consumer Goods",
    },
    role: {
      es: "Estrategia de Identidad de Marca",
      en: "Brand Identity Strategy",
    },
    description: {
      es: "Diseñamos un ecosistema de marca completo y empaques con alto impacto visual ('Shelf-Impact') para el sector alimentario y de consumo masivo. Desarrollamos manuales técnicos de identidad que garantizan una coherencia absoluta entre el packaging físico y la presencia digital de la marca.",
      en: "We designed a complete brand ecosystem and high-impact packaging ('Shelf-Impact') for the food and consumer goods sector. We developed technical identity manuals ensuring absolute consistency between physical packaging and the brand's digital presence.",
    },
    previewImages: [
      "portada-1.webp",
      "packaging.webp",
      "mockup-del-producto.webp",
    ],
    images: [
      { src: "portada-1.webp", alt: "Jambú — Cover", aspect: "wide" },
      { src: "logo.webp", alt: "Jambú — Logo", aspect: "wide" },
      { src: "logo-2.webp", alt: "Jambú — Logo Alt", aspect: "wide" },
      { src: "packaging.webp", alt: "Jambú — Packaging", aspect: "wide" },
      { src: "mockup-del-producto.webp", alt: "Jambú — Product Mockup", aspect: "wide" },
      { src: "mockup-con-frase-publicitaria.webp", alt: "Jambú — Tagline Mockup", aspect: "wide" },
      { src: "mockup-de-imagen-publicitaria.webp", alt: "Jambú — Advertising Mockup", aspect: "wide" },
      { src: "mockup-totebag.webp", alt: "Jambú — Tote Bag Mockup", aspect: "wide" },
      { src: "carteles-publcidad-de-exterior.webp", alt: "Jambú — Outdoor Posters", aspect: "wide" },
      { src: "publicidad-exterior.webp", alt: "Jambú — Outdoor Advertising", aspect: "wide" },
    ],
    participation: [
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
    ],
  },

  "the-decant-society": {
    slug: "the-decant-society",
    title: "The Decant Society",
    folder: "the-decant-society",
    subtitle: {
      es: "Identidad de marca sofisticada y plataforma e-commerce para perfumería premium.",
      en: "Sophisticated brand identity and e-commerce platform for premium perfumery.",
    },
    industry: {
      es: "Perfumería, Belleza y E-commerce Premium",
      en: "Perfumery, Beauty & Premium E-commerce",
    },
    role: {
      es: "Estrategia de Identidad de Marca y E-commerce",
      en: "Brand Identity Strategy & E-commerce",
    },
    description: {
      es: "Desarrollamos una identidad visual sofisticada y memorable para The Decant Society, elevando su presencia en el mercado de la perfumería y las fragancias premium. Diseñamos un sistema gráfico elegante y construimos una plataforma de e-commerce optimizada, capturando la exclusividad de la marca. Visita el proyecto en https://thedecantsociety.com/",
      en: "We developed a sophisticated and memorable visual identity for The Decant Society, elevating its presence in the premium perfumery and fragrance market. We designed an elegant graphic system and built an optimized e-commerce platform, capturing the brand's exclusivity. Visit the project at https://thedecantsociety.com/",
    },
    previewImages: [
      "portada.webp",
      "mini-1.webp",
      "mini-2.webp",
    ],
    images: [
      { src: "portada.webp", alt: "The Decant Society — Cover", aspect: "wide" },
      { src: "1.webp", alt: "The Decant Society — 1", aspect: "wide" },
      { src: "2.webp", alt: "The Decant Society — 2", aspect: "wide" },
      { src: "3.webp", alt: "The Decant Society — 3", aspect: "wide" },
      { src: "4.webp", alt: "The Decant Society — 4", aspect: "wide" },
      { src: "5.webp", alt: "The Decant Society — 5", aspect: "wide" },
      { src: "6.webp", alt: "The Decant Society — 6", aspect: "wide" },
      { src: "7.webp", alt: "The Decant Society — 7", aspect: "wide" },
    ],
    participation: [
      { icon: "star", text: { es: "Estrategia de Identidad de Marca", en: "Brand Identity Strategy" } },
      { icon: "bar", text: { es: "E-commerce", en: "E-commerce" } },
    ],
  },
};
