#!/bin/bash
# Sesiones compartidas entre IAs (Claude, Codex, Gemini…) en miiles-briefs.
# Objetivo: que nadie sobrescriba ni borre el trabajo del otro, y que todo quede con historial.
#
#   ./sesion.sh inicio <IA>                       → OBLIGATORIO al empezar: trae lo último, muestra qué hizo el otro y respalda
#   ./sesion.sh guardar <IA> "mensaje" archivo…   → guarda SOLO esos archivos con historial y los sube a GitHub
#   ./sesion.sh historial [archivo]               → quién cambió qué (de todo el repo o de un archivo)
#   ./sesion.sh recuperar <commit> archivo        → regresa un archivo a como estaba en ese commit (queda como cambio sin guardar)
#   ./sesion.sh respaldo                          → crea un respaldo con fecha y hora (tag) y lo sube
#   ./sesion.sh galeria                           → abre la galería de componentes en http://localhost:5199
set -u
cd "$(dirname "$0")"
cmd=${1:-ayuda}; shift || true

respaldo() {
  local t="respaldo-$(date +%Y-%m-%d-%H%M)"
  git tag "$t" && git push -q origin "$t" && echo "Respaldo creado: $t  (para volver: git checkout $t -- <archivo>)"
}

case "$cmd" in
  inicio)
    ia=${1:?Uso: ./sesion.sh inicio <IA>}
    echo "== Sesión de $ia · $(date '+%Y-%m-%d %H:%M') =="
    git fetch -q origin --tags
    if [ -n "$(git status --porcelain)" ]; then
      echo; echo "!! Hay cambios SIN GUARDAR en la carpeta (pueden ser de la otra IA o de una sesión anterior)."
      echo "   NO los toques, NO los borres y NO los incluyas en tus commits. Pregúntale a Manuel de quién son:"
      git status --short | sed 's/^/     /'
    fi
    behind=$(git rev-list --count HEAD..origin/main)
    if [ "$behind" -gt 0 ]; then
      echo; echo "Trayendo $behind cambio(s) nuevos de GitHub…"
      git merge --ff-only -q origin/main 2>/dev/null || git merge -q --no-edit origin/main || { echo "!! No se pudo combinar: avisa a Manuel antes de seguir."; exit 1; }
    fi
    echo; echo "== Últimos cambios (revisa qué hizo la otra IA) =="
    git log -15 --date=format:'%m-%d %H:%M' --format='  %h  %ad  %s'
    echo; echo "== Bitácora: quién está trabajando en qué =="
    sed -n '/^## En curso/,/^## Historial/p' docs/BITACORA.md | sed '$d'
    hoy="respaldo-$(date +%Y-%m-%d)"
    if ! git tag -l "$hoy*" | grep -q .; then echo; respaldo; fi
    echo; echo "Siguiente paso: anota en docs/BITACORA.md (sección En curso) qué archivos vas a tocar, y guárdalo:"
    echo "  ./sesion.sh guardar $ia \"Empiezo: <tarea>\" docs/BITACORA.md"
    ;;
  guardar)
    ia=${1:?IA}; msg=${2:?mensaje}; shift 2
    [ $# -gt 0 ] || { echo "Indica los archivos a guardar (solo los tuyos). Nunca uses 'git add -A'."; exit 1; }
    git add -- "$@" && git commit -q -m "[$ia] $msg" -- "$@" || { echo "Nada que guardar."; exit 0; }
    git fetch -q origin
    if [ "$(git rev-list --count HEAD..origin/main)" -gt 0 ]; then
      git merge -q --no-edit origin/main || { echo "!! Conflicto con cambios de la otra IA. No sobrescribas: avisa a Manuel."; exit 1; }
    fi
    git push -q origin HEAD:main && echo "Guardado y subido: $(git log -1 --format='%h %s')"
    ;;
  historial)
    if [ $# -gt 0 ]; then git log --follow -20 --date=format:'%m-%d %H:%M' --format='  %h  %ad  %s' -- "$1"
    else git log -30 --date=format:'%m-%d %H:%M' --format='  %h  %ad  %s'; fi
    ;;
  recuperar)
    c=${1:?commit}; f=${2:?archivo}
    git checkout "$c" -- "$f" && echo "$f regresó a $c. Revísalo y guárdalo con ./sesion.sh guardar si es correcto."
    ;;
  respaldo) respaldo ;;
  galeria)
    echo "Galería en http://localhost:5199  (Ctrl+C para cerrar)"
    python3 -c "import http.server,functools; H=http.server.SimpleHTTPRequestHandler; H.extensions_map['.html']='text/html; charset=utf-8'; http.server.test(HandlerClass=functools.partial(H, directory='remotion/galeria'), port=5199, bind='127.0.0.1')"
    ;;
  *) sed -n '2,12p' "$0" ;;
esac
