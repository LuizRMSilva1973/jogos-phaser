<?php
require_once __DIR__ . '/../config.php';

if (!isset($_SESSION['usuario_id'])) {
  header('Location: ../login.php');
  exit;
}

// Busca a assinatura do usuário
$stmt = $pdo->prepare('SELECT stripe_subscription_id FROM usuarios WHERE id = ?');
$stmt->execute([$_SESSION['usuario_id']]);
$row = $stmt->fetch();
$subId = $row['stripe_subscription_id'] ?? null;
if (!$subId) {
  header('Location: ../painel.php?msg=nosub');
  exit;
}

if (empty($STRIPE_SECRET_KEY) || strpos($STRIPE_SECRET_KEY, 'sk_') !== 0) {
  http_response_code(500);
  echo 'Stripe secret key ausente. Configure STRIPE_SECRET_KEY no ambiente.';
  exit;
}

// Cancelamento no fim do período (mais seguro)
$ch = curl_init('https://api.stripe.com/v1/subscriptions/' . urlencode($subId));
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_HTTPHEADER => [
    'Authorization: Bearer ' . $STRIPE_SECRET_KEY,
    'Content-Type: application/x-www-form-urlencoded',
  ],
  CURLOPT_POSTFIELDS => http_build_query(['cancel_at_period_end' => 'true']),
]);
$res = curl_exec($ch);
if ($res === false) {
  header('Location: ../painel.php?msg=cancel_err');
  exit;
}
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status >= 400) {
  header('Location: ../painel.php?msg=cancel_err');
  exit;
}

// Marca como "cancelling" localmente; webhook vai finalizar
$pdo->prepare("UPDATE usuarios SET stripe_status='cancelling' WHERE id = ?")->execute([$_SESSION['usuario_id']]);

header('Location: ../painel.php?msg=cancel_ok');
exit;

