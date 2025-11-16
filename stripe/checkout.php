<?php
require_once __DIR__ . '/../config.php';

if (!isset($_SESSION['usuario_id'])) {
  header('Location: ../login.php');
  exit;
}

// Verificações básicas
if (empty($STRIPE_SECRET_KEY) || strpos($STRIPE_SECRET_KEY, 'sk_') !== 0) {
  http_response_code(500);
  echo 'Stripe secret key ausente. Configure STRIPE_SECRET_KEY no ambiente.';
  exit;
}
if (empty($STRIPE_PRICE_ID) || strpos($STRIPE_PRICE_ID, 'price_') !== 0) {
  http_response_code(500);
  echo 'Stripe price ID ausente. Configure STRIPE_PRICE_ID no ambiente.';
  exit;
}

// Recupera email do usuário para pré-preencher no Stripe
$stmt = $pdo->prepare('SELECT email FROM usuarios WHERE id = ?');
$stmt->execute([$_SESSION['usuario_id']]);
$row = $stmt->fetch();
$email = $row['email'] ?? null;

// URLs de retorno
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$base = $scheme . '://' . $host;
$success = $base . '/stripe/sucesso.php';
$cancel  = $base . '/assinar.php';

// Monta payload do Checkout Session
$fields = [
  'mode' => $STRIPE_MODE,
  'line_items[0][price]' => $STRIPE_PRICE_ID,
  'line_items[0][quantity]' => 1,
  'success_url' => $success,
  'cancel_url' => $cancel,
  'client_reference_id' => (string) $_SESSION['usuario_id'],
  'metadata[usuario_id]' => (string) $_SESSION['usuario_id'],
];
// Propaga metadata para Subscription/PaymentIntent
if ($STRIPE_MODE === 'subscription') {
  $fields['subscription_data[metadata][usuario_id]'] = (string) $_SESSION['usuario_id'];
} else {
  $fields['payment_intent_data[metadata][usuario_id]'] = (string) $_SESSION['usuario_id'];
}
if ($email) { $fields['customer_email'] = $email; }

$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    'Authorization: Bearer ' . $STRIPE_SECRET_KEY,
    'Content-Type: application/x-www-form-urlencoded',
  ],
  CURLOPT_POSTFIELDS => http_build_query($fields),
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
  echo 'Erro na criação do Checkout: ' . htmlspecialchars($res);
  exit;
}

header('Location: ' . $data['url']);
exit;
