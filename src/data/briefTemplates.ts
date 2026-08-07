import { BriefTemplate } from '../types/brief';

export const BRIEF_TEMPLATES: BriefTemplate[] = [
  {
    id: 'branding-identidad',
    slug: 'branding',
    title: 'Identidad de marca',
    badge: 'Identidad',
    description: 'Define a quién le hablas, qué problema resuelves y cómo diferenciarte de forma consistente en diseño, comunicación y estrategia.',
    icon: 'Sparkles',
    estimatedTime: '3 min',
    totalQuestions: 19,
    welcomeSubtitle: '¡Hola! Este brief te ayuda a tomar decisiones claras sobre tu marca: define a quién le hablas, qué problema resuelves y cómo diferenciarte de forma consistente en diseño, comunicación y estrategia.',
    ctaText: 'Empezar',
    submitText: 'Finalizar',
    questions: [
      // Sección 1 — Contexto del negocio
      {
        id: 'b-name',
        section: 'Contexto del negocio',
        type: 'text',
        title: '¿Cómo se llama tu marca?',
        placeholder: 'Ej. Lumina, Nova Studio, Tu Nombre...',
        required: true,
      },
      {
        id: 'b-brand-type',
        section: 'Contexto del negocio',
        type: 'single-choice',
        title: '¿Qué clase de marca es?',
        required: true,
        options: [
          {
            id: 'personal',
            label: 'Marca personal',
            description: 'Firmas con tu propio nombre y reputación individual.',
          },
          {
            id: 'corporativa',
            label: 'Marca corporativa',
            description: 'Firmas con el logotipo y nombre de tu empresa o negocio.',
          },
        ],
      },
      {
        id: 'b-offer',
        section: 'Contexto del negocio',
        type: 'textarea',
        title: '¿Qué ofreces?',
        subtitle: 'Consultoría, producto, educación financiera, servicios creativos, etc.',
        placeholder: 'Describe brevemente tus productos, servicios o soluciones clave...',
        required: true,
      },
      {
        id: 'b-problem-solved',
        section: 'Contexto del negocio',
        type: 'textarea',
        title: '¿Qué problema resuelve?',
        subtitle: 'Ejemplo: Airbnb no solo ofrece hospedaje, resuelve la necesidad de pertenecer en cualquier lugar y encontrar estancias auténticas a precios más humanos.',
        placeholder: '¿Cuál es la necesidad o problema central que tu marca resuelve?',
        required: true,
      },
      {
        id: 'b-project-stage',
        section: 'Contexto del negocio',
        type: 'multiple-choice',
        title: 'Estado actual del proyecto',
        subtitle: 'Selecciona una o más opciones que describan el momento de tu marca.',
        required: true,
        options: [
          {
            id: 'idea',
            label: 'Idea',
            description: 'En etapa conceptual y validando la propuesta de valor.',
          },
          {
            id: 'pruebas',
            label: 'En etapa de pruebas',
            description: 'Con prototipo o MVP funcionando con primeros clientes.',
          },
          {
            id: 'crecimiento',
            label: 'En crecimiento',
            description: 'Con tracción activa y buscando acelerar el alcance.',
          },
          {
            id: 'consolidacion',
            label: 'En consolidación',
            description: 'Empresa establecida optimizando procesos y posicionamiento.',
          },
        ],
      },

      // Sección 2 — Filosofía de la marca
      {
        id: 'b-mission',
        section: 'Filosofía de la marca',
        type: 'textarea',
        title: '¿Cuál es tu misión?',
        subtitle: 'El propósito fundamental por el que existe tu marca en el presente.',
        placeholder: 'Nuestra misión es...',
        required: true,
      },
      {
        id: 'b-vision',
        section: 'Filosofía de la marca',
        type: 'textarea',
        title: '¿Cuál es tu visión?',
        subtitle: '¿Dónde y cómo ves a tu marca en los próximos 3 a 5 años?',
        placeholder: 'En los próximos años, aspiramos a...',
        required: true,
      },
      {
        id: 'b-values',
        section: 'Filosofía de la marca',
        type: 'textarea',
        title: '¿Cuáles son los valores de tu marca?',
        subtitle: 'Principios no negociables que rigen tus decisiones y cultura.',
        placeholder: 'Ej. Simplicidad, honestidad radical, excelencia estética, empatía...',
        required: true,
      },
      {
        id: 'b-origin-story',
        section: 'Filosofía de la marca',
        type: 'textarea',
        title: '¿Cómo empezó todo?',
        subtitle: 'Breve historia de la marca y la chispa o anécdota que dio origen al proyecto.',
        placeholder: 'Todo comenzó cuando...',
        required: true,
      },

      // Sección 3 — Público objetivo
      {
        id: 'b-target-persona',
        section: 'Público objetivo',
        type: 'textarea',
        title: '¿Cómo es tu cliente ideal?',
        subtitle: 'Comportamiento, ubicación, intereses, nivel socioeconómico y estilo de vida.',
        placeholder: 'Mi cliente ideal es alguien que...',
        required: true,
      },
      {
        id: 'b-target-painpoints',
        section: 'Público objetivo',
        type: 'textarea',
        title: '¿Cuáles son los principales dolores de tu cliente ideal?',
        subtitle: 'Ejemplo: Nike no vende solo tenis; resuelve la frustración de la inactividad, la falta de motivación o la duda personal con "Just Do It". ¿Qué frustra o preocupa a tu cliente?',
        placeholder: 'Sus mayores frustraciones, miedos o dolores son...',
        required: true,
      },

      // Sección 4 — Sobre el diferenciador de tu marca
      {
        id: 'b-differentiator',
        section: 'Diferenciador',
        type: 'single-choice',
        title: '¿Has identificado tu diferenciador?',
        subtitle: 'Aquello que te distingue y te hace la única opción lógica para tu cliente ideal.',
        hasConditionalInput: true,
        conditionalTriggerId: 'si',
        conditionalInputLabel: 'Describe tu diferenciador clave:',
        conditionalInputPlaceholder: 'Escribe aquí cuál es tu diferenciador único y por qué te eligen a ti...',
        required: true,
        options: [
          {
            id: 'si',
            label: 'Sí, tengo claro mi diferenciador',
            description: 'Escribe a continuación qué te hace único en el mercado.',
          },
          {
            id: 'no',
            label: 'No, aún no lo tengo definido',
            description: 'Te ayudaremos a descubrirlo y construirlo en la fase estratégica.',
          },
        ],
      },

      // Sección 5 — Territorio visual y verbal
      {
        id: 'b-communication-tone',
        section: 'Territorio visual y verbal',
        sectionHeader: 'Si tu marca fuera una persona que te encuentras en la calle...',
        type: 'textarea',
        title: '¿Cómo sería su Tono de comunicación?',
        subtitle: 'Formal, cercano, provocador, sofisticado, directo, pedagógico, etc.',
        placeholder: 'Hablaría de forma...',
        required: true,
      },
      {
        id: 'b-words-to-avoid',
        section: 'Territorio visual y verbal',
        sectionHeader: 'Si tu marca fuera una persona que te encuentras en la calle...',
        type: 'textarea',
        title: '¿Qué clase de palabras o expresiones debería evitar?',
        subtitle: 'Ejemplo: Expresiones como "barato", "oferta", "económico", jerga excesivamente técnica o clichés del sector.',
        placeholder: 'Palabras o frases que nunca deberían asociarse con la marca...',
        required: true,
      },

      // Sección 6 — Tagline
      {
        id: 'b-tagline',
        section: 'Tagline',
        type: 'textarea',
        title: 'En una frase, describe qué sensación provoca tu marca',
        subtitle: 'Ejemplo: "Totalmente Palacio" evoca exclusividad, elegancia y estatus. ¿Qué emoción instantánea o frase define la tuya?',
        placeholder: 'La sensación o lema que transmite nuestra marca es...',
        required: true,
      },

      // Sección 7 — Dirección visual
      {
        id: 'b-clothing-style',
        section: 'Dirección visual',
        sectionHeader: 'Si tu marca fuera una persona que te encuentras en la calle...',
        type: 'textarea',
        title: '¿Qué clase de ropa usaría?',
        subtitle: 'Ejemplo: Traje sastre impecable monocromático, ropa deportiva técnica streetwear, estilo minimalista oversize neutro, etc.',
        placeholder: 'Vestiría con estilo...',
        required: true,
      },
      {
        id: 'b-colors',
        section: 'Dirección visual',
        type: 'color-picker',
        title: '¿Qué color o colores definen tu marca?',
        subtitle: 'Agrega hasta 6 colores. Puedes usar el selector, meter un código HEX o elegir una sugerencia.',
        required: true,
        allowUndefined: true,
      },

      // Sección 8 — Experiencia de marca
      {
        id: 'b-touchpoints',
        section: 'Experiencia de marca',
        type: 'single-choice',
        title: '¿Dónde interactúa el cliente?',
        subtitle: 'El punto de contacto principal o canal donde se vive la experiencia.',
        required: true,
        options: [
          {
            id: 'web',
            label: 'Sitio web & Plataforma Digital',
            description: 'Landing page, tienda en línea o plataforma web interactiva.',
          },
          {
            id: 'fisico',
            label: 'Espacio Físico',
            description: 'Tienda física, oficina, showroom, estudio o eventos presenciales.',
          },
          {
            id: 'redes',
            label: 'Redes sociales & Contenido',
            description: 'Instagram, TikTok, WhatsApp, LinkedIn o YouTube.',
          },
          {
            id: 'hibrido',
            label: 'Omnicanal / Híbrido',
            description: 'Presencia combinada en físico, digital y redes sociales.',
          },
        ],
      },

      // Sección 9 — Inspiración (última pantalla)
      {
        id: 'b-inspiration',
        section: 'Inspiración',
        type: 'textarea',
        title: '¿Qué otras marcas te parecen inspiradoras y por qué?',
        subtitle: 'Puedes agregar el link directo a su web o perfil de Instagram para tomarlas de referencia visual y estratégica.',
        placeholder: '1) Marca A (link) — Por su minimalismo. 2) Marca B (link) — Por su tono directo...',
        required: true,
      },
    ],
  },
  {
    id: 'web-digital-product',
    slug: 'web-design',
    title: 'Diseño Web & Digital',
    highlightWord: 'Experience',
    badge: 'Web & UI',
    description: 'Landing pages de alto impacto, plataformas web y experiencias interactivas optimizadas.',
    icon: 'Globe',
    estimatedTime: '3 min',
    totalQuestions: 6,
    welcomeSubtitle: 'Creemos una experiencia web inolvidable que convierta visitas en clientes leales.',
    ctaText: 'Empezar',
    submitText: 'Finalizar',
    questions: [
      {
        id: 'web-project-name',
        section: 'Contexto del Proyecto',
        type: 'text',
        title: '¿Cómo se llama tu empresa o sitio?',
        subtitle: 'Incluye también la URL actual si ya tienes un sitio existente.',
        placeholder: 'Ej. Miiles Studio — https://wearemiiles.com',
        required: true,
      },
      {
        id: 'web-main-goal',
        section: 'Objetivos del Sitio',
        type: 'single-choice',
        title: '¿Cuál es el objetivo principal de la web?',
        subtitle: 'El propósito principal dictará la arquitectura y los llamados a la acción.',
        required: true,
        options: [
          { id: 'goal-leads', label: 'Captación de Clientes / Leads', description: 'Conseguir cotizaciones, llamadas y formularios calificados.', icon: 'Target', badge: 'Conversion' },
          { id: 'goal-ecommerce', label: 'Tienda Online / E-Commerce', description: 'Venta directa de productos o membresías en línea.', icon: 'ShoppingBag', badge: 'Ventas' },
          { id: 'goal-authority', label: 'Autoridad & Portfolio de Lujo', description: 'Mostrar proyectos, trayectoria y posicionamiento premium.', icon: 'Award', badge: 'Branding' },
          { id: 'goal-saas', label: 'Plataforma Web / App Interactiva', description: 'Herramienta interactiva con login, dashboards o IA.', icon: 'Cpu', badge: 'Producto' }
        ]
      },
      {
        id: 'web-scope',
        section: 'Alcance & Módulos',
        type: 'multiple-choice',
        title: '¿Qué módulos o páginas clave contemplas?',
        subtitle: 'Selecciona todas las que apliquen.',
        required: true,
        options: [
          { id: 'p-home', label: 'Home Page de Alto Impacto', description: 'Hero dinámico, video showcase y propuesta de valor.' },
          { id: 'p-services', label: 'Sección / Páginas de Servicios', description: 'Detalle de soluciones, procesos y casos de éxito.' },
          { id: 'p-portfolio', label: 'Showcase / Galería de Proyectos', description: 'Fichas interactivas con mockups y resultados.' },
          { id: 'p-briefs', label: 'Sistema de Briefs / Formularios', description: 'Experiencia interactiva paso a paso para tus clientes.' },
          { id: 'p-blog', label: 'Blog / Centro de Recursos SEO', description: 'Artículos y contenidos para posicionamiento en Google.' },
          { id: 'p-auth', label: 'Área de Clientes / Autenticación', description: 'Portal privado para tus clientes o usuarios.' }
        ]
      },
      {
        id: 'web-features',
        section: 'Funcionalidades',
        type: 'multiple-choice',
        title: '¿Qué funcionalidades especiales deseas?',
        subtitle: 'Para crear una experiencia interactiva sin fricciones.',
        required: true,
        options: [
          { id: 'feat-animations', label: 'Animaciones Fluidas & Micro-interacciones', description: 'Scroll interactivo, transiciones suaves y sensaciones premium.' },
          { id: 'feat-darkmode', label: 'Modo Oscuro / Modo Claro', description: 'Selector de tema elegante con contraste impecable.' },
          { id: 'feat-multilang', label: 'Multi-idioma (Español / Inglés)', description: 'Soporte para cambio de idioma instantáneo.' },
          { id: 'feat-crm', label: 'Integración con CRM / WhatsApp', description: 'Conexión automática de leads a tu base de datos o correo.' },
          { id: 'feat-cms', label: 'Gestor de Contenido Autoadministrable', description: 'Para editar textos, imágenes y proyectos fácilmente.' }
        ]
      },
      {
        id: 'web-timeline',
        section: 'Tiempos',
        type: 'single-choice',
        title: '¿Cuál es tu tiempo estimado de lanzamiento?',
        subtitle: 'Para planificar el roadmap de diseño y desarrollo.',
        required: true,
        options: [
          { id: 'time-urgent', label: 'Urgente (1 a 2 semanas)', description: 'Sprint intensivo para lanzamiento inmediato.', icon: 'Zap' },
          { id: 'time-standard', label: 'Estándar (3 a 5 semanas)', description: 'Ritmo ideal de diseño, iteración y desarrollo.', icon: 'Clock' },
          { id: 'time-flexible', label: 'Flexible / En planificación', description: 'Explorando opciones para el próximo trimestre.', icon: 'Calendar' }
        ]
      },

      {
        id: 'web-contact',
        section: 'Contacto',
        type: 'text',
        title: 'Tus datos de contacto para enviarte la propuesta:',
        subtitle: 'Te enviaremos el desglose técnico y propuesta comercial.',
        placeholder: 'Tu nombre, email y teléfono / WhatsApp',
        required: true,
      }
    ]
  },
  {
    id: 'growth-content',
    slug: 'growth',
    title: 'Estrategia & Contenido',
    highlightWord: 'Digital',
    badge: 'Impacto',
    description: 'Campañas visuales, assets publicitarios y contenido que impulsa el crecimiento de tu marca.',
    icon: 'TrendingUp',
    estimatedTime: '3 min',
    totalQuestions: 6,
    welcomeSubtitle: 'Escale tu mensaje con narrativa visual y estrategia de contenidos de alta retención.',
    ctaText: 'Empezar',
    submitText: 'Finalizar',
    questions: [
      {
        id: 'growth-brand',
        section: 'Presencia Actual',
        type: 'text',
        title: 'Nombre de tu marca y redes actuales:',
        subtitle: 'Compártenos tus perfiles (Instagram, TikTok, Web) para auditarlos.',
        placeholder: '@tumarca | https://instagram.com/tumarca',
        required: true,
      },
      {
        id: 'growth-goal',
        section: 'Objetivos',
        type: 'single-choice',
        title: '¿Cuál es el principal reto de crecimiento?',
        subtitle: 'Nos enfocaremos en resolver este cuello de botella.',
        required: true,
        options: [
          { id: 'gr-sales', label: 'Aumentar ventas directas', description: 'Estrategia orientada a performance y conversión de clientes.', icon: 'DollarSign' },
          { id: 'reach', label: 'Aumentar alcance & seguidores', description: 'Contenido viral, storytelling y retención.', icon: 'Eye' },
          { id: 'authority', label: 'Construir autoridad de marca', description: 'Contenido educativo de alto valor y posicionamiento premium.', icon: 'ShieldCheck' },
          { id: 'launch', label: 'Lanzamiento de nuevo producto', description: 'Campaña integral de expectativa, apertura y cierre.', icon: 'Flame' }
        ]
      },
      {
        id: 'growth-channels',
        section: 'Canales',
        type: 'multiple-choice',
        title: '¿En qué canales quieres enfocarte?',
        subtitle: 'Selecciona los ecosistemas donde vive tu audiencia ideal.',
        required: true,
        options: [
          { id: 'ch-instagram', label: 'Instagram (Reels, Carruseles, Stories)' },
          { id: 'ch-tiktok', label: 'TikTok (Videos cortos y dinámicos)' },
          { id: 'ch-youtube', label: 'YouTube (Shorts y videos largos)' },
          { id: 'ch-linkedin', label: 'LinkedIn (B2B y marca personal)' },
          { id: 'ch-ads', label: 'Meta Ads & Google Ads' }
        ]
      },
      {
        id: 'growth-budget',
        section: 'Presupuesto',
        type: 'budget-slider',
        title: 'Presupuesto mensual estimado para contenido:',
        subtitle: 'Inversión en producción creativa y estrategia.',
        required: true,
        budgetOptions: [
          { id: 'gb1', label: 'Starter Pack', range: '$500 - $900 USD / mes', popular: false },
          { id: 'gb2', label: 'Growth Plan', range: '$900 - $1,800 USD / mes', popular: true },
          { id: 'gb3', label: 'Dominio Total', range: '+$1,800 USD / mes', popular: false }
        ]
      },
      {
        id: 'growth-notes',
        section: 'Audiencia',
        type: 'textarea',
        title: '¿Algún detalle extra sobre tu audiencia?',
        subtitle: '¿Quién es tu cliente ideal? ¿Qué edad tiene y qué problemas le resuelves?',
        placeholder: 'Describe a tu cliente ideal o detalles de tu nicho...',
        required: false,
      },
      {
        id: 'growth-contact',
        section: 'Contacto',
        type: 'text',
        title: 'Correo y WhatsApp para enviarte el plan:',
        subtitle: 'Revisaremos tus perfiles y te presentaremos un roadmap.',
        placeholder: 'nombre@correo.com / +52 55 ...',
        required: true,
      }
    ]
  }
];
