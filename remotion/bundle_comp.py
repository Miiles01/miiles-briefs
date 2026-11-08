import re, sys
import os
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src") + "/"
shared = open(SRC + "shared.tsx").read()
shared_body = shared[shared.index("export type Card"):].replace("export const miilesCards", "export const exampleItems")

ASSETS = "https://wearemiiles.com/studio/componentes/assets/"

def autosuficiente(s):
    """El código que se copia desde miiles.app debe funcionar en un proyecto nuevo, sin nuestros archivos:
    - los ejemplos (fotos, íconos y tipografías) apuntan a copias públicas en wearemiiles.com;
    - archivo(p) usa la URL tal cual si empieza con http, o busca en public/ si es una ruta local."""
    # Advercase (demo, sin licencia para repartirla) no se publica: en el código público se usa Gambarino (Fontshare)
    s = s.replace('"fonts/Advercase-Regular.otf"', '"fonts/Gambarino-Regular.woff2"')
    s = s.replace("""   - Tipografías: pon los archivos en public/fonts/ (Manrope.woff2 para el texto y
     Advercase-Regular.otf para las palabras resaltadas) o cambia "font" y
     "highlightFont" por las que quieras. Advercase gratis no trae acentos: úsala
     solo en palabras sin acento.""", """   - Tipografías: ya cargan solas desde wearemiiles.com (Manrope para el texto y
     Gambarino para las palabras resaltadas). Para usar otras, pon el archivo en
     public/fonts/ y cambia "font" y "highlightFont" (p. ej. "fonts/MiLetra.woff2").""")
    s = re.sub(r'"(carrusel|fonts)/([A-Za-z0-9_.-]+\.(?:jpg|png|svg|woff2|otf|ttf))"', lambda m: '"' + ASSETS + m.group(2) + '"', s)
    if "staticFile(" in s:
        s = s.replace("staticFile(", "archivo(")
        m = re.search(r'import \{([^}]*)\} from "remotion";', s)
        names = [x.strip() for x in m.group(1).split(",") if x.strip()]
        if "staticFile" not in names: names.append("staticFile")
        s = s.replace(m.group(0), 'import { ' + ", ".join(names) + ' } from "remotion";')
        last = list(re.finditer(r'^import .*;$', s, flags=re.M))[-1]
        helper = ('\n\n// Archivos: si la ruta empieza con http se usa tal cual (los ejemplos viven en wearemiiles.com y funcionan sin copiar nada);'
                  '\n// si es una ruta local (p. ej. "fotos/mia.jpg"), se busca en la carpeta public/ de tu proyecto.'
                  '\nconst archivo = (p: string) => (/^https?:\\/\\//.test(p) ? p : staticFile(p));\n')
        s = s[:last.end()] + helper + s[last.end():]
    return s

def bundle(name, out):
    s = open(SRC + name).read()
    if '"./shared"' in s:
        s = re.sub(r'import \{[^}]*\} from "\./shared";\n', "", s)
        # asegurar Img y staticFile en el import de remotion
        m = re.search(r'import \{([^}]*)\} from "remotion";', s)
        names = [x.strip() for x in m.group(1).split(",") if x.strip()]
        for need in ("Img", "staticFile"):
            if need not in names: names.append(need)
        s = s.replace(m.group(0), 'import { ' + ", ".join(names) + ' } from "remotion";')
        # quitar el tipo Card local si ya lo define el bloque compartido
        s = re.sub(r'\ntype Card = \{[^}]*\};\n', "\n", s)
        last = list(re.finditer(r'^import .*;$', s, flags=re.M))[-1]
        s = s[:last.end()] + "\n\n// ---- Tarjetas (foto, o color con ícono SVG) ----\n" + shared_body.rstrip() + "\n" + s[last.end():]
    elif re.search(r"items: Card\[\]", s) and "exampleItems" not in s:
        ex = shared_body[shared_body.index("export const exampleItems"):]
        s = s.rstrip() + "\n\n// Ejemplo de tarjetas (cámbialas por tus fotos o colores con ícono en public/)\n" + ex.rstrip() + "\n"
    s = autosuficiente(s)
    assert "./shared" not in s and "shared.tsx" not in s
    open(out, "w").write(s)
    print(out, len(s))

for a in sys.argv[1:]:
    n, o = a.split("=")
    bundle(n, o)
