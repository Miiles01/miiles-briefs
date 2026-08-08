import { BriefTemplate } from '../types/brief';

export const BRIEF_TEMPLATES: BriefTemplate[] = [
  {
    id: 'branding-identidad',
    slug: 'branding',
    title: 'Identidad de marca',
    badge: 'Identidad',
    description: 'Define a quién le hablas, qué problema resuelves y cómo diferenciarte de forma consistente en diseño, comunicación y estrategia.',
    icon: 'Sparkles',
    estimatedTime: '8 min',
    totalQuestions: 20,
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
        id: 'b-brand-summary',
        section: 'Contexto del negocio',
        type: 'textarea',
        title: '¿Qué hace tu marca y qué ofrece?',
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
            description: 'Con tracción comercial y buscando escalar con marca sólida.',
          },
          {
            id: 'posicionada',
            label: 'Posicionada',
            description: 'Marca consolidada buscando rediseño o refresh estratégico.',
          },
        ],
      },

      // Sección 2 — Audiencia y cliente ideal
      {
        id: 'b-target-audience',
        section: 'Audiencia y cliente ideal',
        type: 'textarea',
        title: '¿A quién le vendes principalmente?',
        subtitle: 'Describe a tu cliente ideal: edad aproximada, intereses, dolores o retos principales.',
        placeholder: 'Ej. Jóvenes profesionales de 25-35 años que buscan optimizar su tiempo...',
        required: true,
      },
      {
        id: 'b-ideal-client-state',
        section: 'Audiencia y cliente ideal',
        type: 'single-choice',
        title: '¿Cómo llega el cliente antes de encontrarte?',
        subtitle: 'El estado mental o emocional en el que se encuentra cuando busca tu solución.',
        required: true,
        options: [
          {
            id: 'frustrado',
            label: 'Frustrado / Abrumado',
            description: 'Ha probado otras alternativas sin obtener el resultado esperado.',
          },
          {
            id: 'desorientado',
            label: 'Desorientado / Principiante',
            description: 'No sabe exactamente por dónde empezar y necesita claridad o guía experta.',
          },
          {
            id: 'ambicioso',
            label: 'Ambicioso / En búsqueda de subir de nivel',
            description: 'Ya tiene bases pero busca la mejor opción premium para destacar.',
          },
          {
            id: 'urgencia',
            label: 'Con necesidad urgente',
            description: 'Requiere una solución inmediata y confiable para un problema puntual.',
          },
        ],
      },

      // Sección 3 — Propósito y visión
      {
        id: 'b-purpose',
        section: 'Propósito y visión',
        type: 'textarea',
        title: '¿Por qué existe este proyecto más allá del dinero?',
        subtitle: 'La razón fundamental, convicción o impacto que te motiva a construir esta marca.',
        placeholder: 'Construyo esta marca porque creo firmemente que...',
        required: true,
      },
      {
        id: 'b-brand-future',
        section: 'Propósito y visión',
        type: 'textarea',
        title: '¿Dónde ves a tu marca en 3 a 5 años?',
        subtitle: 'Tu visión a mediano plazo: expansión de servicios, impacto en la industria, reconocimiento.',
        placeholder: 'Visualizo la marca como referente en...',
        required: true,
      },

      // Sección 4 — Diferenciación y posicionamiento
      {
        id: 'b-differentiator-choice',
        section: 'Diferenciación y posicionamiento',
        type: 'single-choice',
        title: '¿Tienes claro tu diferenciador principal?',
        subtitle: 'Aquello único que hace que te elijan a ti sobre cualquier competidor.',
        required: true,
        hasConditionalInput: true,
        conditionalTriggerId: 'si',
        conditionalInputLabel: 'Describe tu diferenciador principal:',
        conditionalInputPlaceholder: 'Ej. Metodología propia validada, atención hiperpersonalizada 1 a 1, tecnología propietaria, etc.',
        options: [
          {
            id: 'si',
            label: 'Sí, lo tengo claro',
            description: 'Sé con certeza qué me hace único frente a la competencia.',
          },
          {
            id: 'no',
            label: 'Aún no, quiero definirlo con ustedes',
            description: 'Necesito ayuda estratégica para encontrar mi ángulo diferenciador.',
          },
        ],
      },
      {
        id: 'b-competitors',
        section: 'Diferenciación y posicionamiento',
        type: 'textarea',
        title: '¿Quiénes son tus competidores o referentes?',
        subtitle: 'Nombres de marcas, cuentas de Instagram o sitios web que admires o con quienes compitas.',
        placeholder: '1. Marca A (@cuenta)\n2. Marca B (sitio.com)\n3. Referente inspiracional...',
        required: true,
        allowUndefined: true,
      },

      // Sección 5 — Personalidad y tono de voz
      {
        id: 'b-tone',
        section: 'Personalidad y tono',
        type: 'multiple-choice',
        title: '¿Qué tono describe mejor a tu marca?',
        subtitle: 'Selecciona de 1 a 3 adjetivos que representen cómo debe sonar tu comunicación.',
        required: true,
        options: [
          {
            id: 'cercano',
            label: 'Cercana y Humana',
            description: 'Empática, accesible, cálida y conversacional.',
          },
          {
            id: 'sofisticado',
            label: 'Sofisticada y Elegante',
            description: 'Exclusiva, sobria, cuidada y con alto estándar estético.',
          },
          {
            id: 'audaz',
            label: 'Audaz y Disruptiva',
            description: 'Directa, enérgica, sin rodeos y que desafía lo convencional.',
          },
          {
            id: 'profesional',
            label: 'Experta y Rigurosa',
            description: 'Autoridad técnica, respaldada en datos, metodológica y confiable.',
          },
          {
            id: 'creativa',
            label: 'Creativa y Juguetona',
            description: 'Innovadora, fresca, ingeniosa y memorable.',
          },
          {
            id: 'minimalista',
            label: 'Minimalista y Esencial',
            description: 'Directa al punto, limpia, sin ruido ni adornos innecesarios.',
          },
        ],
      },

      // Sección 6 — Arquetipo de marca
      {
        id: 'b-archetype',
        section: 'Arquetipo de marca',
        type: 'single-choice',
        title: '¿Con qué arquetipo se identifica tu marca?',
        subtitle: 'El arquetipo define el rol psicológico que juegas en la mente de tu audiencia.',
        required: true,
        options: [
          {
            id: 'sabio',
            label: 'El Sabio / Mentor',
            description: 'Guía, comparte conocimiento profundo y ayuda a entender con claridad.',
          },
          {
            id: 'heroe',
            label: 'El Héroe / Transformador',
            description: 'Supera obstáculos, impulsa a tomar acción y genera resultados tangibles.',
          },
          {
            id: 'mago',
            label: 'El Mago / Innovador',
            description: 'Hace que lo complejo parezca magia, crea experiencias extraordinarias.',
          },
          {
            id: 'gobernante',
            label: 'El Gobernante / Líder',
            description: 'Establece el estándar de excelencia, orden y estatus en su categoría.',
          },
          {
            id: 'creador',
            label: 'El Creador / Visionario',
            description: 'Da vida a cosas que no existían, obsesionado con el detalle y el diseño.',
          },
          {
            id: 'rebelde',
            label: 'El Rebelde / Forajido',
            description: 'Rompe las reglas del juego tradicionales y crea su propio camino.',
          },
        ],
      },

      // Sección 7 — Dirección visual y estética
      {
        id: 'b-clothing-analogy',
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
        subtitle: 'Recomendado agregar de 2 a 3 colores principales.',
        required: true,
        allowUndefined: true,
      },
      {
        id: 'b-typography-style',
        section: 'Dirección visual',
        type: 'image-gallery',
        title: '¿Cuál de estas tipografías crees que podrían representar mejor tu marca?',
        subtitle: 'Selecciona una o más referencias que resuenen con la visión estética de tu proyecto.',
        required: true,
        allowUndefined: true,
        imageOptions: [
          { id: 'typo-1', url: '/tipografia/104d9a8cce07bc400306497f66a72a6a.jpg' },
          { id: 'typo-2', url: '/tipografia/1f33624f98edf0ab9cc032a915330540.jpg' },
          { id: 'typo-3', url: '/tipografia/2a89b91663bdbbbb5771515c836264d7.jpg' },
          { id: 'typo-4', url: '/tipografia/3a9d82a2b9c9b057b592c36048c7cde2.jpg' },
          { id: 'typo-5', url: '/tipografia/435614356446bf26c5d4fdd48a343b46.jpg' },
          { id: 'typo-6', url: '/tipografia/450845ada40fdf8f588cc3ee924102dc.jpg' },
          { id: 'typo-7', url: '/tipografia/5235f4e995af4d76926022ec5eba90a8.jpg' },
          { id: 'typo-8', url: '/tipografia/60623bcabc43118889f5218cf554d2d5.jpg' },
          { id: 'typo-9', url: '/tipografia/6bab53de6cd5214654a6e8f84c3cdd5f.jpg' },
          { id: 'typo-10', url: '/tipografia/7a448646dd2fc6634ec8277377aceef9.jpg' },
          { id: 'typo-11', url: '/tipografia/8bf7782e03898c93d0b4fd97e18cecc7.jpg' },
          { id: 'typo-12', url: '/tipografia/8f211bea4aa602b7084fe4c5e911714b.jpg' },
          { id: 'typo-13', url: '/tipografia/905b22b4a2cf043a11e0c2c83b441de3.jpg' },
          { id: 'typo-14', url: '/tipografia/c96b1164ae49bf64b6b31fb128ea4abf.jpg' },
          { id: 'typo-15', url: '/tipografia/c9c8b626df900dc98ef6a8e21f055bd7.jpg' },
          { id: 'typo-16', url: '/tipografia/c9eab539173c7f3bd63996e34c7ed48c.jpg' },
          { id: 'typo-17', url: '/tipografia/d607620952f89d03e80d608c57f69c71.jpg' },
          { id: 'typo-18', url: '/tipografia/ec91551c2e7e130e808a06cc8d18b2e5.jpg' },
          { id: 'typo-19', url: '/tipografia/f1350b36a6411660218ce460d0e6ebef.jpg' },
          { id: 'typo-20', url: '/tipografia/fce69ea63a03c17c31230aed42ec71dd.jpg' },
          { id: 'typo-21', url: '/tipografia/b27d28297949fde9852ec7e1c0ff4e84.jpg' },
        ],
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
