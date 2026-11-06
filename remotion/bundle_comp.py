import re, sys
import os
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src") + "/"
shared = open(SRC + "shared.tsx").read()
shared_body = shared[shared.index("export type Card"):].replace("export const miilesCards", "export const exampleItems")

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
    assert "./shared" not in s
    open(out, "w").write(s)
    print(out, len(s))

for a in sys.argv[1:]:
    n, o = a.split("=")
    bundle(n, o)
