<?php
// Miiles: muestra en wearemiiles.com/<usuario> las páginas publicadas desde Miiles.
// Sube este archivo a public_html junto con el .htaccess. No necesita configuración.
$origin = 'https://iobgtqomewcnhayoyzhb.supabase.co/functions/v1/site-serve/';
// Página 404 con diseño (en lugar del texto plano)
function miiles_not_found() {
  http_response_code(404);
  header('Content-Type: text/html; charset=utf-8');
  echo <<<'HTML'
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Página no encontrada · Miiles</title>
<link rel="icon" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">
<style>
@font-face{font-family:'Welth Catritz';src:url(/fonts/WelthCatritz-Italic.woff2) format('woff2'),url(/fonts/WelthCatritz-Italic.woff) format('woff');font-style:italic;font-display:swap}
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{display:flex;flex-direction:column;min-height:100vh;background:#fafaf8;color:#111;font-family:'Poppins',system-ui,sans-serif;font-weight:300;-webkit-font-smoothing:antialiased}
header{padding:28px 6vw}
header img{display:block;height:22px;width:auto}
main{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;max-width:900px;width:100%;margin:0 auto;padding:40px 6vw 80px}
.code{font-size:14px;font-weight:400;color:#4059F1;margin:0 0 18px}
h1{margin:0;font-weight:400;font-size:clamp(44px,7vw,92px);line-height:1;letter-spacing:-.03em}
h1 em{font-family:'Welth Catritz',serif;font-style:italic;font-weight:400;padding-right:.08em}
p.lead{margin:24px 0 0;max-width:520px;font-size:clamp(16px,1.6vw,19px);line-height:1.6;color:#4B4F63}
.btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px}
a.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;border-radius:999px;font-size:15px;font-weight:400;text-decoration:none;transition:background-color .3s,color .3s}
a.btn.solid{background:#111;color:#fff}
a.btn.solid:hover{background:#FCB5B9;color:#111}
a.btn.ghost{background:#EEEFF2;color:#111}
a.btn.ghost:hover{background:#E8ECFE}
</style>
</head>
<body>
<header><a href="/" aria-label="Miiles, inicio"><img src="/logotipo.svg" alt="Miiles"></a></header>
<main>
  <p class="code">Error 404</p>
  <h1>Esta página se <em>perdió</em> en el camino</h1>
  <p class="lead">La dirección que buscas no existe o ya no está publicada. Revisa que esté bien escrita o regresa al inicio para seguir explorando Miiles.</p>
  <div class="btns">
    <a class="btn solid" href="/">Ir al inicio</a>
    <a class="btn ghost" href="javascript:history.back()">Regresar</a>
  </div>
</main>
</body>
</html>
HTML;
  exit;
}
$path = isset($_GET['miiles_path']) ? $_GET['miiles_path'] : '';
if (!preg_match('#^[A-Za-z0-9][A-Za-z0-9._/-]{0,250}$#', $path) || strpos($path, '..') !== false) {
  miiles_not_found();
}
$ch = curl_init($origin . $path);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HEADER => true, CURLOPT_FOLLOWLOCATION => false, CURLOPT_TIMEOUT => 20]);
$res = curl_exec($ch);
if ($res === false) { http_response_code(502); echo 'No se pudo cargar la página'; exit; }
$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);
if ($status == 404) miiles_not_found();   // la página del usuario no existe
$headers = substr($res, 0, $headerSize);
$body = substr($res, $headerSize);
http_response_code($status);
$type = 'text/plain; charset=utf-8';
foreach (explode("\r\n", $headers) as $line) {
  if (stripos($line, 'X-Miiles-Content-Type:') === 0) $type = trim(substr($line, 22));
  if (stripos($line, 'Location:') === 0) header('Location: ' . trim(substr($line, 9)));
  if (stripos($line, 'Cache-Control:') === 0) header($line);
}
header('Content-Type: ' . $type);
header('X-Content-Type-Options: nosniff');
echo $body;
