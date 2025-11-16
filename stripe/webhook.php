<?php
require_once __DIR__ . '/../config.php';

// Verifica assinatura do webhook manualmente (sem stripe-php)
function verifyStripeSignature($payload, $header, $secret, $tolerance = 300) {
  if (!$header || !$secret) return false;
  $items = [];
  foreach (explode(',', $header) as $part) {
    [$k, $v] = array_pad(explode('=', trim($part), 2), 2, null);
    if ($k && $v) $items[$k] = $v;
  }
  if (empty($items['t']) || empty($items['v1'])) return false;
  // Verifica tolerância de tempo (5 min)
  if (abs(time() - (int)$items['t']) > $tolerance) return false;
  $signed = $items['t'] . '.' . $payload;
  $expected = hash_hmac('sha256', $signed, $secret);
  // timing-attack safe compare
  return hash_equals($expected, $items['v1']);
}

$payload = file_get_contents('php://input') ?: '';
$sig = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if (empty($STRIPE_WEBHOOK_SECRET)) {
  http_response_code(500);
  echo 'Webhook secret não configurado';
  exit;
}

if (!verifyStripeSignature($payload, $sig, $STRIPE_WEBHOOK_SECRET)) {
  http_response_code(400);
  echo 'Assinatura inválida';
  exit;
}

$event = json_decode($payload, true);
if (!is_array($event)) {
  http_response_code(400);
  echo 'Payload inválido';
  exit;
}

$type = $event['type'] ?? '';
if ($type === 'checkout.session.completed') {
  $obj = $event['data']['object'] ?? [];
  $status = $obj['status'] ?? '';
  $uid  = $obj['metadata']['usuario_id'] ?? ($obj['client_reference_id'] ?? null);
  $customer = $obj['customer'] ?? null;
  $subscription = $obj['subscription'] ?? null;
  if ($uid && $status === 'complete') {
    $stmt = $pdo->prepare("UPDATE usuarios SET plano='premium', stripe_customer_id = COALESCE(?, stripe_customer_id), stripe_subscription_id = COALESCE(?, stripe_subscription_id), stripe_status = ? WHERE id = ?");
    $stmt->execute([$customer, $subscription, 'active', $uid]);
  }
}

// Atualizações de assinatura (mantém premium enquanto ativa)
if ($type === 'customer.subscription.updated' || $type === 'customer.subscription.created') {
  $sub = $event['data']['object'] ?? [];
  $uid = $sub['metadata']['usuario_id'] ?? null;
  $status = $sub['status'] ?? '';
  $customer = $sub['customer'] ?? null;
  $subId = $sub['id'] ?? null;
  if ($uid) {
    if (in_array($status, ['active','trialing','past_due'])) {
      $pdo->prepare("UPDATE usuarios SET plano='premium', stripe_customer_id = COALESCE(?, stripe_customer_id), stripe_subscription_id = COALESCE(?, stripe_subscription_id), stripe_status = ? WHERE id = ?")->execute([$customer, $subId, $status, $uid]);
    } elseif (in_array($status, ['canceled','unpaid','incomplete_expired'])) {
      $pdo->prepare("UPDATE usuarios SET plano='free', stripe_status = ? WHERE id = ?")->execute([$status, $uid]);
    }
  }
}

if ($type === 'customer.subscription.deleted') {
  $sub = $event['data']['object'] ?? [];
  $uid = $sub['metadata']['usuario_id'] ?? null;
  if ($uid) {
    $pdo->prepare("UPDATE usuarios SET plano='free', stripe_status = 'canceled' WHERE id = ?")->execute([$uid]);
  }
}

// Você pode tratar outros eventos aqui (subscription updates, etc.)

http_response_code(200);
echo json_encode(['ok' => true]);
