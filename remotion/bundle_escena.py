"""Empaqueta una ESCENA (src/Escena*.tsx) en un solo archivo autosuficiente para miiles.app.

Uso:  cd remotion/src && python3 ../bundle_escena.py EscenaSplit.tsx=../../public/studio/componentes/escena-split.tsx.txt

- Mete dentro del archivo lo que la escena usa de UGCMotor.tsx (tipografías, colores y curvas).
- Los archivos de ejemplo (video de la creadora, fotos, tipografías) apuntan a copias públicas en
  wearemiiles.com/studio/componentes/assets/ (funciona tal cual en un proyecto nuevo).
- Advercase (demo sin licencia para repartirla) se cambia por Gambarino.
- Agrega un bloque "CÓMO USAR ESTA ESCENA" para la IA de cada usuario: cambiar el video y el guion.
"""
import re, sys

ASSETS = "https://wearemiiles.com/studio/componentes/assets/"

BASE = '''
// ---- Base de las escenas Miiles (tipografías, colores y curvas) ----
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SANS = "UM-Manrope, Helvetica, Arial, sans-serif";
const DISPLAY = "UM-Advercase, UM-Manrope, sans-serif";   // Advercase/Gambarino SOLO en palabras sin acento
const AZUL = "#4059F1";
const CREMA = "#F4F3EF";
const Fuentes: React.FC = () => {
  const [h] = useState(() => delayRender("Fuentes"));
  useEffect(() => {
    Promise.all([
      new FontFace("UM-Manrope", `url(${staticFile("fonts/Manrope.woff2")})`, { weight: "200 800" }).load(),
      new FontFace("UM-Advercase", `url(${staticFile("fonts/Advercase-Regular.otf")})`).load(),
    ]).then((fs) => { fs.forEach((x) => document.fonts.add(x)); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
  return null;
};
'''

COMO_USAR = '''/* ============================================================================
   CÓMO USAR ESTA ESCENA (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Es una ESCENA de Remotion: una parte de un Reel (1080×1920 a 30 fps) sobre el video de
     una creadora hablando a cámara. Funciona tal cual: el video, las fotos y las tipografías
     de ejemplo cargan desde wearemiiles.com.
   - Para usarla con TU video:
       1. Pon tu video en public/ (p. ej. "mi-video.mp4") y cambia la ruta del video de ejemplo
          (busca "creadora-hook.mp4") por la tuya.
       2. Transcribe el audio CON TIEMPOS POR PALABRA (p. ej. faster-whisper con word_timestamps)
          y reemplaza la lista P (palabra, segundo en que empieza). Ajusta INICIO al segundo
          de tu video donde empieza la escena.
       3. Los momentos de la animación están atados a palabras (ini(i)): revisa que caigan
          en las palabras correctas de tu guion.
   - Reglas: captions en una línea y al ritmo de la voz; nada de texto arriba de y≈300 ni abajo
     de y≈1450 (interfaz de Reels/TikTok).
   ========================================================================== */
'''

def autosuficiente(s):
    s = s.replace('"fonts/Advercase-Regular.otf"', '"fonts/Gambarino-Regular.woff2"')
    s = s.replace('"creadora-hook.mp4"', '"' + ASSETS + 'creadora-hook.mp4"')
    s = re.sub(r'"(carrusel|fonts)/([A-Za-z0-9_.-]+\.(?:jpg|png|svg|woff2|otf|ttf))"', lambda m: '"' + ASSETS + m.group(2) + '"', s)
    if "staticFile(" in s:
        s = s.replace("staticFile(", "archivo(")
        last = list(re.finditer(r'^import .*;$', s, flags=re.M))[-1]
        helper = ('\n\n// Archivos: si la ruta empieza con http se usa tal cual (los ejemplos viven en wearemiiles.com);'
                  '\n// si es una ruta local (p. ej. "mi-video.mp4"), se busca en la carpeta public/ de tu proyecto.'
                  '\nconst archivo = (p: string) => (/^https?:\\/\\//.test(p) ? p : staticFile(p));\n')
        s = s[:last.end()] + helper + s[last.end():]
    return s

def asegurar(s, modulo, nombres):
    patron = r'import (React, )?\{([^}]*)\} from "' + re.escape(modulo) + '";' if modulo == "react" else r'import \{([^}]*)\} from "' + re.escape(modulo) + '";'
    if modulo == "react":
        m = re.search(r'import React(?:, \{([^}]*)\})? from "react";', s)
        tiene = [x.strip() for x in (m.group(1) or "").split(",") if x.strip()]
        for n in nombres:
            if n not in tiene: tiene.append(n)
        return s.replace(m.group(0), 'import React, { ' + ", ".join(tiene) + ' } from "react";')
    m = re.search(patron, s)
    tiene = [x.strip() for x in m.group(1).split(",") if x.strip()]
    for n in nombres:
        if n not in tiene: tiene.append(n)
    return s.replace(m.group(0), 'import { ' + ", ".join(tiene) + ' } from "' + modulo + '";')

def bundle(nombre, salida):
    s = open(nombre).read()
    s = re.sub(r'import \{[^}]*\} from "\./UGCMotor";\n', "", s)
    assert "./UGCMotor" not in s and './shared' not in s, "la escena importa otros archivos locales"
    s = asegurar(s, "react", ["useEffect", "useState"])
    s = asegurar(s, "remotion", ["Easing", "continueRender", "delayRender", "staticFile"])
    last = list(re.finditer(r'^import .*;$', s, flags=re.M))[-1]
    s = s[:last.end()] + "\n" + BASE + s[last.end():]
    s = COMO_USAR + s
    s = autosuficiente(s)
    open(salida, "w").write(s)
    print(salida, len(s))

for a in sys.argv[1:]:
    n, o = a.split("=")
    bundle(n, o)
