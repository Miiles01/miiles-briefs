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
body{display:flex;flex-direction:column;min-height:100vh;min-height:100svh;background:#fafaf8;color:#111;font-family:'Poppins',system-ui,sans-serif;font-weight:300;-webkit-font-smoothing:antialiased;overflow-x:hidden}
header{padding:26px 6vw}
header img{display:block;height:22px;width:auto}
main{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px 6vw 60px}
h1{margin:0;text-wrap:balance;font-weight:400;font-size:clamp(28px,3.6vw,52px);line-height:1.1;letter-spacing:-.02em;max-width:16em}
h1 em{white-space:nowrap;font-family:'Welth Catritz',serif;font-style:italic;font-weight:400;padding-right:.08em}
/* 404 enorme con las barras de color de Miiles detrás del cero */
.big{position:relative;display:flex;align-items:center;justify-content:center;margin:2vh 0 1vh;font-weight:400;font-size:clamp(150px,30vw,440px);line-height:.9;letter-spacing:-.06em}
.big > span{position:relative;z-index:2}
.zero{position:relative}
.bars{position:absolute;left:38%;bottom:10%;z-index:-1;display:flex;align-items:flex-end;gap:.035em;pointer-events:none}
.bars i{display:block;width:.13em;border-radius:.02em .02em 0 0;background:linear-gradient(180deg,#4059F1,#E8ECFE);transform-origin:50% 100%;animation:grow 1.1s cubic-bezier(.2,.8,.2,1) both}
.bars i:nth-child(2){background:linear-gradient(180deg,#FCB5B9,#FEEDED)}
.bars i:nth-child(1){height:.34em;animation-delay:.1s}
.bars i:nth-child(2){height:.5em;animation-delay:.22s}
.bars i:nth-child(3){height:.66em;animation-delay:.34s}
.bars i:nth-child(4){height:.82em;animation-delay:.46s}
@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
p.lead{margin:8px 0 0;max-width:460px;font-size:clamp(15px,1.4vw,17px);line-height:1.6;color:#4B4F63}
.btns{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:30px}
a.btn{display:inline-flex;align-items:center;gap:8px;padding:15px 26px;border-radius:999px;font-size:15px;font-weight:400;text-decoration:none;transition:background-color .3s,color .3s}
a.btn.solid{background:#111;color:#fff}
a.btn.solid:hover{background:#FCB5B9;color:#111}
a.btn.ghost{background:#EEEFF2;color:#111}
a.btn.ghost:hover{background:#E8ECFE}
@media (prefers-reduced-motion:reduce){.bars i{animation:none}}
</style>
</head>
<body>
<header><a href="https://wearemiiles.com/" aria-label="Miiles, inicio"><img src="/logotipo.svg" alt="Miiles"></a></header>
<main>
  <h1>No encontramos la página <em>que buscas</em></h1>
  <p class="big" aria-label="Error 404"><span>4</span><span class="zero">0<span class="bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span></span><span>4</span></p>
  <p class="lead">La dirección no existe o ya no está publicada. Elige a dónde quieres ir.</p>
  <div class="btns">
    <a class="btn solid" href="https://wearemiiles.com/">Ir al portafolio ↗</a>
    <a class="btn ghost" href="https://miiles.app/">Ir a la app de trabajo ↗</a>
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
