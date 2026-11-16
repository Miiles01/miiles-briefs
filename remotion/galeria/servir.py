#!/usr/bin/env python3
"""Servidor local de la galería de componentes (http://localhost:5199).

Por qué no basta `python3 -m http.server`: no responde peticiones con `Range` (siempre manda el
archivo completo con 200). Sin eso, Chrome no puede saltar dentro de un video: al mover la barra
de progreso el video regresa al inicio. Este servidor responde 206 Partial Content con
Accept-Ranges, sirve el HTML en UTF-8 y no guarda caché del index (los videos usan ?v= para eso).

Uso:  python3 servir.py [puerto]      (por defecto 5199, solo en 127.0.0.1)
"""
import functools
import http.server
import os
import re
import sys

CARPETA = os.path.dirname(os.path.abspath(__file__))


class Manejador(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".html": "text/html; charset=utf-8", ".mp4": "video/mp4", ".webm": "video/webm"}

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        if self.path.split("?")[0].endswith((".html", "/")):
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        rango = self.headers.get("Range")
        ruta = self.translate_path(self.path)
        if not rango or not os.path.isfile(ruta):
            return super().send_head()
        m = re.match(r"bytes=(\d*)-(\d*)$", rango.strip())
        total = os.path.getsize(ruta)
        if not m or (m.group(1) == "" and m.group(2) == ""):
            return super().send_head()
        if m.group(1) == "":                      # bytes=-N → los últimos N
            inicio, fin = max(0, total - int(m.group(2))), total - 1
        else:
            inicio = int(m.group(1))
            fin = min(int(m.group(2)), total - 1) if m.group(2) else total - 1
        if inicio >= total or inicio > fin:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{total}")
            self.end_headers()
            return None
        f = open(ruta, "rb")
        f.seek(inicio)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(ruta))
        self.send_header("Content-Range", f"bytes {inicio}-{fin}/{total}")
        self.send_header("Content-Length", str(fin - inicio + 1))
        self.end_headers()
        self._restante = fin - inicio + 1
        return f

    def copyfile(self, source, outputfile):
        restante = getattr(self, "_restante", None)
        if restante is None:
            return super().copyfile(source, outputfile)
        try:
            while restante > 0:
                bloque = source.read(min(64 * 1024, restante))
                if not bloque:
                    break
                outputfile.write(bloque)
                restante -= len(bloque)
        except (BrokenPipeError, ConnectionResetError):
            pass                                   # el navegador cancela rangos al saltar: es normal
        finally:
            self._restante = None

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 5199
    http.server.ThreadingHTTPServer.daemon_threads = True
    http.server.test(HandlerClass=functools.partial(Manejador, directory=CARPETA),
                     ServerClass=http.server.ThreadingHTTPServer, port=puerto, bind="127.0.0.1")
