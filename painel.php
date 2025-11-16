<?php
require 'config.php';

$logado = isset($_SESSION['usuario_id']);
$nome   = $_SESSION['usuario_nome'] ?? '';
$plano  = $_SESSION['usuario_plano'] ?? 'free';
$erro = $_GET['erro'] ?? '';

// Carrega status atualizado do banco (evita sessão desatualizada)
$stripe_status = null;
$has_customer = false;
if ($logado) {
  $stmt = $pdo->prepare('SELECT plano, stripe_status, stripe_customer_id FROM usuarios WHERE id = ?');
  $stmt->execute([$_SESSION['usuario_id']]);
  if ($row = $stmt->fetch()) {
    $plano = $row['plano'];
    $_SESSION['usuario_plano'] = $plano;
    $stripe_status = $row['stripe_status'];
    $has_customer = !empty($row['stripe_customer_id']);
  }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Painel</title>
  <style>
    body{max-width:900px;margin:32px auto;padding:0 16px;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial}
    .card{border:1px solid #e1e5ea;border-radius:10px;padding:16px;margin:16px 0}
    .badge{display:inline-block;padding:4px 10px;border-radius:999px;background:#eef2ff;color:#1f3b8f;font-size:12px}
    .btn{display:inline-block;padding:10px 14px;border-radius:8px;background:#0a84ff;color:#fff;text-decoration:none}
    .btn.secondary{background:#64748b}
    .muted{color:#6b7280}
  </style>
</head>
<body>
  <header style="display:flex;align-items:center;justify-content:space-between;gap:12px">
    <h1 style="margin:0">Painel</h1>
    <nav>
      <?php if ($logado): ?>
        <span class="muted">Olá, <?= htmlspecialchars($nome) ?>!</span>
        <a class="btn secondary" href="logout.php" style="margin-left:12px">Sair</a>
      <?php else: ?>
        <a class="btn" href="login.php">Entrar</a>
        <a class="btn secondary" href="cadastro.php">Cadastrar</a>
      <?php endif; ?>
    </nav>
  </header>

  <?php if ($erro === 'plano'): ?>
    <p style="color:#b91c1c">Você precisa de um plano Premium para acessar esse jogo.</p>
  <?php endif; ?>

  <section class="card">
    <h2 style="margin-top:0">Seu Plano</h2>
    <?php if ($logado): ?>
      <p>Status: <span class="badge"><?= htmlspecialchars(strtoupper($plano)) ?></span>
        <?php if ($stripe_status): ?>
          <span class="muted">(Stripe: <?= htmlspecialchars($stripe_status) ?>)</span>
        <?php endif; ?>
      </p>
      <?php if ($plano !== 'premium'): ?>
        <p>Desbloqueie os jogos premium assinando o plano:</p>
        <a class="btn" href="assinar.php">Assinar Premium</a>
      <?php else: ?>
        <p>Obrigado por ser Premium! 🎉</p>
        <?php if ($has_customer): ?>
          <p style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
            <a class="btn secondary" href="stripe/portal.php">Gerenciar no Portal</a>
            <form method="post" action="stripe/cancel.php" onsubmit="return confirm('Confirmar cancelamento ao fim do período?');">
              <button class="btn secondary" type="submit">Cancelar Assinatura</button>
            </form>
          </p>
        <?php endif; ?>
      <?php endif; ?>
    <?php else: ?>
      <p>Faça login para ver seu plano.</p>
    <?php endif; ?>
  </section>

  <section class="card">
    <h2 style="margin-top:0">Jogos</h2>
    <ul>
      <li>
        <strong>Jogo Premium (Phaser)</strong><br>
        <small class="muted">Requer login e plano Premium</small><br>
        <a class="btn" href="jogo-premium.php" style="margin-top:8px;display:inline-block">Abrir</a>
      </li>
    </ul>
  </section>

  <footer class="muted" style="margin-top:24px">© Sua Marca</footer>
</body>
</html>
