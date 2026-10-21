<?php
// Miiles: muestra en wearemiiles.com/<usuario> las páginas publicadas desde Miiles.
// Sube este archivo a public_html junto con el .htaccess. No necesita configuración.
$origin = 'https://iobgtqomewcnhayoyzhb.supabase.co/functions/v1/site-serve/';
$path = isset($_GET['miiles_path']) ? $_GET['miiles_path'] : '';
if (!preg_match('#^[A-Za-z0-9][A-Za-z0-9._/-]{0,250}$#', $path) || strpos($path, '..') !== false) {
  http_response_code(404); echo 'Página no encontrada'; exit;
}
$ch = curl_init($origin . $path);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HEADER => true, CURLOPT_FOLLOWLOCATION => false, CURLOPT_TIMEOUT => 20]);
$res = curl_exec($ch);
if ($res === false) { http_response_code(502); echo 'No se pudo cargar la página'; exit; }
$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);
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
