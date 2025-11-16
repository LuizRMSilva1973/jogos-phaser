<?php
require_once __DIR__ . '/../config.php';

if (!isset($_SESSION['usuario_id'])) {
  header('Location: ../login.php');
  exit;
}

// Busca o customer salvo
$stmt = $pdo->prepare('SELECT stripe_customer_id FROM usuarios WHERE id = ?');
$stmt->execute([$_SESSION['usuario_id']]);
$row = $stmt->fetch();
$customer = $row['stripe_customer_id'] ?? null;
if (!$customer) {
  http_response_code(400);
  echo 'Cliente Stripe não encontrado para sua conta.';
  exit;
}

if (empty($STRIPE_SECRET_KEY) || strpos($STRIPE_SECRET_KEY, 'sk_') !== 0) {
  http_response_code(500);
  echo 'Stripe secret key ausente. Configure STRIPE_SECRET_KEY no ambiente.';
  exit;
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$base = $scheme . '://' . $host;
$return_url = $base . '/painel.php';

$ch = curl_init('https://api.stripe.com/v1/billing_portal/sessions');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    'Authorization: Bearer ' . $STRIPE_SECRET_KEY,
    'Content-Type: application/x-www-form-urlencoded',
  ],
  CURLOPT_POSTFIELDS => http_build_query([
    'customer' => $customer,
    'return_url' => $return_url,
  ]),
]);
$res = curl_exec($ch);
if ($res === false) {
  http_response_code(500);
  echo 'Erro ao conectar na Stripe.';
  exit;
}
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($res, true);
if ($status >= 400 || empty($data['url'])) {
  http_response_code(500);
  echo 'Erro ao criar sessão do Portal: ' . htmlspecialchars($res);
  exit;
}

header('Location: ' . $data['url']);
exit;

