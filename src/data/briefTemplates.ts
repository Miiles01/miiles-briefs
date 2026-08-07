import { BriefTemplate } from '../types/brief';

export const BRIEF_TEMPLATES: BriefTemplate[] = [
  {
    id: 'branding-identidad',
    slug: 'branding',
    title: 'Branding & Identidad',
    highlightWord: 'Visual',
    badge: 'Más Popular',
    description: 'Define la esencia, tono, estética y activos visuales de tu marca para destacar con autoridad.',
    icon: 'Sparkles',
    estimatedTime: '4 min',
    totalQuestions: 8,
    welcomeSubtitle: 'Vamos a construir juntos una marca magnética que conecte y convierta.',
    questions: [
      {
        id: 'brand-name',
        type: 'text',
        title: '¿Cuál es el nombre de tu',
        highlightWord: 'Marca',
        subtitle: 'O el nombre provisional si aún está en fase de exploración.',
        placeholder: 'Ej. Lumina Studio, Nova Labs...',
        required: true,
      },
      {
        id: 'brand-stage',
        type: 'single-choice',
        title: '¿En qué etapa se encuentra tu',
        highlightWord: 'Proyecto?',
        subtitle: 'Esto nos ayuda a entender el punto de partida y la velocidad necesaria.',
        required: true,
        options: [
          {
            id: 'stage-new',
            label: 'Marca desde cero',
            description: 'Tengo una idea o negocio nuevo y necesito toda la identidad visual.',
            icon: 'Rocket',
            badge: 'Start'
          },
          {
            id: 'stage-rebrand',
            label: 'Rediseño / Rebranding',
            description: 'Ya tenemos una marca pero necesita una evolución estética profunda.',
            icon: 'RefreshCw',
            badge: 'Evolución'
          },
          {
            id: 'stage-expansion',
            label: 'Expansión de submarca',
            description: 'Marca consolidada que lanza una nueva línea o producto.',
            icon: 'Layers',
            badge: 'Scale'
          }
        ]
      },
      {
        id: 'brand-personality',
        type: 'multiple-choice',
        title: '¿Qué adjetivos definen la',
        highlightWord: 'Personalidad',
        subtitle: 'Selecciona hasta 3 opciones que mejor describan la vibra que buscas proyectar.',
        required: true,
        options: [
          { id: 'pers-luxury', label: 'Lujoso & Exclusivo', description: 'Elegancia sobria, detalles finos y acabados premium.' },
          { id: 'pers-bold', label: 'Disruptivo & Audaz', description: 'Rompe convenciones, tipografías con carácter e impacto.' },
          { id: 'pers-minimal', label: 'Minimalista & Tech', description: 'Líneas limpias, espacios generosos y claridad absoluta.' },
          { id: 'pers-warm', label: 'Cálido & Orgánico', description: 'Sensación humana, acogedora, natural y cercana.' },
          { id: 'pers-vibrant', label: 'Vibrante & Creativo', description: 'Colores audaces, energía juvenil y frescura.' },
          { id: 'pers-corporate', label: 'Sólido & Profesional', description: 'Confianza institucional, seguridad y robustez.' }
        ]
      },
      {
        id: 'brand-palette',
        type: 'color-palette',
        title: 'Elige la dirección',
        highlightWord: 'Cromática',
        subtitle: '¿Qué paleta de color resuena más con la visión de tu proyecto?',
        required: true,
        colorPalettes: [
          {
            id: 'palette-electric',
            name: 'Electric Cobalt & Noir',
            description: 'Moderna, tecnológica, potente y sofisticada.',
            colors: ['#4059F1', '#0B0D1B', '#8FA4FF', '#F4F6FF', '#111528']
          },
          {
            id: 'palette-mono-gold',
            name: 'Obsidian & Champagne',
            description: 'Lujo silencioso, sobriedad y máxima elegancia.',
            colors: ['#0A0A0A', '#E8D5B5', '#222222', '#D1B48C', '#FFFFFF']
          },
          {
            id: 'palette-emerald',
            name: 'Deep Forest & Sage',
            description: 'Orgánica, balanceada, sustentable y premium.',
            colors: ['#0F281E', '#2D5A46', '#87A99C', '#EAF0EC', '#D4E2D9']
          },
          {
            id: 'palette-sunset',
            name: 'Terra & Crimson Flare',
            description: 'Cálida, apasionada, enérgica y distintiva.',
            colors: ['#E63946', '#F4A261', '#2A2E43', '#FAEDCD', '#1D3557']
          }
        ]
      },
      {
        id: 'deliverables',
        type: 'multiple-choice',
        title: '¿Qué entregables específicos',
        highlightWord: 'Necesitas?',
        subtitle: 'Elige todos los elementos que requieres para tu lanzamiento.',
        required: true,
        options: [
          { id: 'del-logo', label: 'Logotipo & Isotipo Principal', description: 'Versiones horizontal, vertical, isotipo y monograma.' },
          { id: 'del-manual', label: 'Brand Guidelines / Manual de Marca', description: 'Reglas de uso, tipografía, paleta de color y espaciado.' },
          { id: 'del-social', label: 'Templates para Redes Sociales', description: 'Plantillas editables para posts, historias y portadas.' },
          { id: 'del-stationery', label: 'Papelería & Presentaciones', description: 'Tarjetas, hojas membretadas y slide deck corporativo.' },
          { id: 'del-packaging', label: 'Packaging & Etiquetas', description: 'Empaque de producto, cajas, bolsas y sellos.' },
          { id: 'del-web-design', label: 'Diseño Web / Landing Page', description: 'Diseño UI/UX completo para tu sitio.' }
        ]
      },
      {
        id: 'references',
        type: 'textarea',
        title: 'Cuéntanos sobre tus marcas',
        highlightWord: 'Referentes',
        subtitle: '¿Qué marcas admiras (locales o globales)? ¿Qué te gusta de ellas (su tono, diseño, experiencia)?',
        placeholder: 'Ejemplo: Nos encanta la simpleza de Apple, la vibra editorial de Aesop y el dinamismo de Spotify...',
        required: false,
      },
      {
        id: 'budget-investment',
        type: 'budget-slider',
        title: '¿Cuál es tu rango de',
        highlightWord: 'Inversión?',
        subtitle: 'Nos ayuda a modular el alcance de la propuesta y priorizar entregables.',
        required: true,
        budgetOptions: [
          { id: 'b1', label: 'Esencial', range: '$800 - $1,500 USD', popular: false },
          { id: 'b2', label: 'Estudio Integral', range: '$1,500 - $3,500 USD', popular: true },
          { id: 'b3', label: 'Ecosistema Completo', range: '$3,500 - $7,000 USD', popular: false },
          { id: 'b4', label: 'Enterprise / A Medida', range: '+$7,000 USD', popular: false }
        ]
      },
      {
        id: 'contact-info',
        type: 'text',
        title: '¿A qué correo te enviamos la',
        highlightWord: 'Propuesta?',
        subtitle: 'Te responderemos con un diagnóstico inicial y cotización detallada.',
        placeholder: 'tu@empresa.com | Nombre y WhatsApp',
        required: true,
      }
    ]
  },
  {
    id: 'web-digital-product',
    slug: 'web-design',
    title: 'Diseño Web & Digital',
    highlightWord: 'Experience',
    badge: 'Alta Conversión',
    description: 'Landing pages de alto impacto, plataformas web y experiencias interactivas optimizadas.',
    icon: 'Globe',
    estimatedTime: '3 min',
    totalQuestions: 7,
    welcomeSubtitle: 'Creemos una experiencia web inolvidable que convierta visitas en clientes leales.',
    questions: [
      {
        id: 'web-project-name',
        type: 'text',
        title: '¿Cómo se llama tu empresa o',
        highlightWord: 'Sitio?',
        subtitle: 'Incluye también la URL actual si ya tienes un sitio existente.',
        placeholder: 'Ej. Miiles Studio — https://wearemiiles.com',
        required: true,
      },
      {
        id: 'web-main-goal',
        type: 'single-choice',
        title: '¿Cuál es el objetivo principal de la',
        highlightWord: 'Web?',
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
        type: 'multiple-choice',
        title: '¿Qué módulos o páginas clave',
        highlightWord: 'Contemplas?',
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
        type: 'multiple-choice',
        title: '¿Qué funcionalidades especiales',
        highlightWord: 'Deseas?',
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
        type: 'single-choice',
        title: '¿Cuál es tu tiempo estimado de',
        highlightWord: 'Lanzamiento?',
        subtitle: 'Para planificar el roadmap de diseño y desarrollo.',
        required: true,
        options: [
          { id: 'time-urgent', label: 'Urgente (1 a 2 semanas)', description: 'Sprint intensivo para lanzamiento inmediato.', icon: 'Zap' },
          { id: 'time-standard', label: 'Estándar (3 a 5 semanas)', description: 'Ritmo ideal de diseño, iteración y desarrollo.', icon: 'Clock' },
          { id: 'time-flexible', label: 'Flexible / En planificación', description: 'Explorando opciones para el próximo trimestre.', icon: 'Calendar' }
        ]
      },
      {
        id: 'web-budget',
        type: 'budget-slider',
        title: 'Rango de inversión para tu',
        highlightWord: 'Desarrollo:',
        subtitle: 'Transparencia para ofrecerte la mejor solución técnica.',
        required: true,
        budgetOptions: [
          { id: 'wb1', label: 'Landing Page Express', range: '$600 - $1,200 USD', popular: false },
          { id: 'wb2', label: 'Sitio Web Completo', range: '$1,200 - $2,800 USD', popular: true },
          { id: 'wb3', label: 'Experiencia Digital / App Web', range: '$2,800 - $5,500 USD', popular: false },
          { id: 'wb4', label: 'Solución Enterprise', range: '+$5,500 USD', popular: false }
        ]
      },
      {
        id: 'web-contact',
        type: 'text',
        title: 'Tus datos de contacto para enviarte la',
        highlightWord: 'Propuesta:',
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
    questions: [
      {
        id: 'growth-brand',
        type: 'text',
        title: 'Nombre de tu marca y redes',
        highlightWord: 'Actuales:',
        subtitle: 'Compártenos tus perfiles (Instagram, TikTok, Web) para auditarlos.',
        placeholder: '@tumarca | https://instagram.com/tumarca',
        required: true,
      },
      {
        id: 'growth-goal',
        type: 'single-choice',
        title: '¿Cuál es el principal reto de',
        highlightWord: 'Crecimiento?',
        subtitle: 'Nos enfocaremos en resolver este cuello de botella.',
        required: true,
        options: [
          { id: 'gr-sales', label: 'Aumentar ventas directas', description: 'Estrategia orientada a performance y conversión de clientes.', icon: 'DollarSign' },
          { id: 'gr-reach', label: 'Aumentar alcance & seguidores', description: 'Contenido viral, storytelling y retención.', icon: 'Eye' },
          { id: 'gr-authority', label: 'Construir autoridad de marca', description: 'Contenido educativo de alto valor y posicionamiento premium.', icon: 'ShieldCheck' },
          { id: 'gr-launch', label: 'Lanzamiento de nuevo producto', description: 'Campaña integral de expectativa, apertura y cierre.', icon: 'Flame' }
        ]
      },
      {
        id: 'growth-channels',
        type: 'multiple-choice',
        title: '¿En qué canales quieres',
        highlightWord: 'Enfocarte?',
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
        type: 'budget-slider',
        title: 'Presupuesto mensual estimado para',
        highlightWord: 'Contenido:',
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
        type: 'textarea',
        title: '¿Algún detalle extra sobre tu',
        highlightWord: 'Audiencia?',
        subtitle: '¿Quién es tu cliente ideal? ¿Qué edad tiene y qué problemas le resuelves?',
        placeholder: 'Describe a tu cliente ideal o detalles de tu nicho...',
        required: false,
      },
      {
        id: 'growth-contact',
        type: 'text',
        title: 'Correo y WhatsApp para enviarte el',
        highlightWord: 'Plan:',
        subtitle: 'Revisaremos tus perfiles y te presentaremos un roadmap.',
        placeholder: 'nombre@correo.com / +52 55 ...',
        required: true,
      }
    ]
  }
];
