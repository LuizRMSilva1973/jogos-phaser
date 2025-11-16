<?php
require 'config.php';
require 'require_premium.php';
?>
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <title>Jogo Premium — Sky Platforms</title>
    <meta name="description" content="Jogo premium protegido por login e plano ativo." />
    <link rel="icon" href="../favicon.svg" />
    <link rel="stylesheet" href="assets/styles.css" />
    <!-- Phaser local -->
    <script src="assets/lib/phaser.min.js" defer></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          try { navigator.serviceWorker.register('./sw.js'); } catch (e) {}
        });
      }
    </script>
    <script src="assets/src/main.js" type="module" defer></script>
  </head>
  <body>
    <div style="padding:10px 14px;background:#0b1220;color:#9fb3c8;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial">
      <strong>Bem-vindo(a), <?= htmlspecialchars($_SESSION['usuario_nome'] ?? '') ?></strong> •
      <a href="painel.php" style="color:#0a84ff">voltar ao painel</a>
    </div>
    <div id="game-root"></div>
    <noscript>Habilite o JavaScript para jogar.</noscript>
  </body>
  </html>
