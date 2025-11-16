<?php
require 'config.php';

// Habilitar manualmente (apenas para validação inicial - remova em produção):
if (isset($_GET['ativar']) && isset($_SESSION['usuario_id'])) {
    $stmt = $pdo->prepare("UPDATE usuarios SET plano='premium' WHERE id = ?");
    $stmt->execute([$_SESSION['usuario_id']]);
    $_SESSION['usuario_plano'] = 'premium';
    header('Location: painel.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Assinar Premium</title>
  <style>body{max-width:720px;margin:40px auto;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial}</style>
</head>
<body>
  <h1>Assinatura Premium</h1>
  <?php if (!isset($_SESSION['usuario_id'])): ?>
    <p>Faça login para continuar: <a href="login.php">Entrar</a></p>
  <?php else: ?>
    <p>Assine para desbloquear os jogos premium. O pagamento é processado pela Stripe com Checkout seguro.</p>
    <form method="post" action="stripe/checkout.php">
      <button type="submit" style="padding:12px 16px;border-radius:8px;background:#0a84ff;color:#fff;border:none;cursor:pointer">Assinar com Stripe</button>
    </form>
    <p style="margin-top:12px">Ambiente de teste: <a href="assinar.php?ativar=1">Marcar como Premium</a> (remova em produção)</p>
    <p class="muted">Certifique-se de definir as variáveis STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET e STRIPE_PRICE_ID no ambiente.</p>
  <?php endif; ?>
  <p><a href="painel.php">Voltar</a></p>
</body>
</html>
