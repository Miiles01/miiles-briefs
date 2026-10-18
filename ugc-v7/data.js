/* ============================================================
   Contenido del portafolio UGC (V7)
   Para crear otra versión, cambia solo este archivo.
   ============================================================ */
window.UGC = (() => {
  const MEDIA = 'https://wearemiiles.com/ugc-v4/media/';

  return {
    nombre: 'Laura',
    rol: 'Creadora de contenido UGC para marcas de belleza, moda y bienestar',
    intro: 'Soy Laura. Hago videos y fotos que se sienten como la recomendación de una amiga: reales, cercanos y pensados para que tu producto se vea en uso.',

    medios: {
      hero: MEDIA + 'hero.jpg',          // retrato principal (horizontal)
      portada: MEDIA + 'portada.jpg',    // foto horizontal a sangre
      sobreMi: MEDIA + 'sobre-mi.jpg',
      // Pastillas de fotos que se intercambian dentro del titular del hero
      pastillas: ['foto-1.jpg', 'foto-4.jpg', 'foto-3.jpg', 'foto-5.jpg', 'foto-2.jpg', 'sobre-mi.jpg'].map(f => MEDIA + f)
    },

    // Palabras de la cinta en movimiento bajo el hero
    cinta: ['Belleza', 'Skincare', 'Moda', 'Bienestar', 'Fitness', 'Lifestyle'],

    marcas: {
      titulo: 'Marcas que confiaron en mí',
      logos: [
        ['adidas-13.svg', 'Adidas'], ['chanel-2.svg', 'Chanel'], ['dji-1.svg', 'DJI'],
        ['loreal.svg', "L'Oréal"], ['la-roche-posay.svg', 'La Roche-Posay'], ['samsung-8.svg', 'Samsung'],
        ['spotify-logo.svg', 'Spotify'], ['vichy-laboratoires.svg', 'Vichy'], ['zoah-1.svg', 'Zoah'],
        ['zara.svg', 'Zara'], ['vogue.svg', 'Vogue'], ['versace.svg', 'Versace'],
        ['pull-bear-2.svg', 'Pull&Bear'], ['bershka-1.svg', 'Bershka'], ['shein.svg', 'Shein']
      ].map(([archivo, nombre]) => ({ src: MEDIA + 'marcas/' + archivo, nombre }))
    },

    // Carrusel: 9 piezas verticales 9:16 (4 videos y 5 fotos)
    contenido: {
      titulo: 'Mi trabajo',
      piezas: [
        { titulo: 'Rutina de cuidado',    tipo: 'Reel', nicho: 'Belleza',   src: MEDIA + 'video-1.mp4' },
        { titulo: 'Ropa deportiva',       tipo: 'Foto', nicho: 'Moda',      src: MEDIA + 'foto-4.jpg' },
        { titulo: 'Primeras impresiones', tipo: 'Reel', nicho: 'Lifestyle', src: MEDIA + 'video-2.mp4' },
        { titulo: 'Entrenamiento',        tipo: 'Foto', nicho: 'Bienestar', src: MEDIA + 'foto-3.jpg' },
        { titulo: 'Reseña honesta',       tipo: 'Reel', nicho: 'Producto',  src: MEDIA + 'video-3.mp4' },
        { titulo: 'Día al aire libre',    tipo: 'Foto', nicho: 'Lifestyle', src: MEDIA + 'foto-1.jpg' },
        { titulo: 'Unboxing',             tipo: 'Reel', nicho: 'Producto',  src: MEDIA + 'video-4.mp4' },
        { titulo: 'Retrato natural',      tipo: 'Foto', nicho: 'Belleza',   src: MEDIA + 'foto-5.jpg' },
        { titulo: 'Selfie de producto',   tipo: 'Foto', nicho: 'UGC',       src: MEDIA + 'foto-2.jpg' }
      ]
    },

    nichos: {
      titulo: 'Nichos en los que trabajo',
      items: [
        { titulo: 'Belleza y skincare',   texto: 'Rutinas, texturas, antes y después y primeras impresiones.' },
        { titulo: 'Moda',                 texto: 'Try-on hauls, outfits y cómo combinar una prenda.' },
        { titulo: 'Bienestar y fitness',  texto: 'Entrenamientos, suplementos y hábitos diarios.' },
        { titulo: 'Lifestyle y hogar',    texto: 'Mi día a día, productos en casa y momentos reales.' }
      ]
    },

    tiposContenido: {
      titulo: 'Qué tipo de contenido hago',
      items: [
        { titulo: 'Videos UGC para anuncios', ejemplo: 'Hook en 3 segundos, problema, solución y llamada a la acción.' },
        { titulo: 'Unboxing',                 ejemplo: 'Abro tu producto y muestro cada detalle por primera vez.' },
        { titulo: 'Reseñas y testimoniales',  ejemplo: 'Opinión honesta a cámara, como recomendación de amiga.' },
        { titulo: 'Tutoriales',               ejemplo: 'Paso a paso de cómo se usa tu producto.' },
        { titulo: 'Fotografía de producto',   ejemplo: 'Fotos lifestyle con el producto en uso.' }
      ]
    },

    sobreMi: {
      titulo: 'Sobre mí',
      parrafos: [
        'Me encargo de todo: idea, guion, grabación y edición en formato vertical, listo para publicar en TikTok, Reels o anuncios.',
        'Trabajo con marcas de belleza, moda y bienestar que buscan contenido honesto que genere confianza y ventas.'
      ]
    },

    testimonios: {
      titulo: 'Lo que dicen de mí',
      items: [
        { texto: 'Laura entendió la visión de nuestra marca desde el primer momento. El contenido superó nuestras expectativas.', cargo: 'Directora de Marketing', empresa: 'Tech Innovators' },
        { texto: 'Su capacidad para contar historias a través de la fotografía es única. Cada proyecto es un éxito garantizado.', cargo: 'Fundador', empresa: 'Artisan Coffee Co.' },
        { texto: 'El nivel de atención al detalle que Laura le puso a nuestra última campaña fue increíble.', cargo: 'Directora de Arte', empresa: 'Fashion Forward' },
        { texto: 'Logró capturar la esencia de lo que somos en cada toma. Es una verdadera profesional.', cargo: 'CEO', empresa: 'Eco Beauty' },
        { texto: 'Transformó por completo la manera en la que nuestra audiencia nos percibe visualmente.', cargo: 'Brand Manager', empresa: 'Luxe Events' },
        { texto: 'Una creatividad desbordante y una técnica impecable. Sus fotos hablan por sí solas.', cargo: 'Editor en Jefe', empresa: 'Revista Estilo' }
      ].map((t, i) => ({ ...t, foto: MEDIA + 'testimonios/persona-' + (i + 1) + '.jpg' }))
    },

    contacto: {
      titulo: 'Hagamos algo juntas',
      texto: 'Cuéntame de tu marca y de lo que necesitas. Te respondo en menos de 24 horas.',
      email: 'hola@lauracreativa.com',
      whatsapp: { texto: 'Escríbeme directo', url: 'https://wa.me/' }
    },

    // Links de relleno por ahora
    redes: [
      { nombre: 'Instagram', usuario: '@laura.ugc', url: 'https://instagram.com' },
      { nombre: 'TikTok',    usuario: '@laura.ugc', url: 'https://tiktok.com' },
      { nombre: 'YouTube',   usuario: '@laura.ugc', url: 'https://youtube.com' }
    ],

    footer: '© 2026 Laura · Plantilla UGC de We Are Miiles'
  };
})();
