<?php
require_once __DIR__ . '/../config.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pagamento Concluído</title>
  <style>body{max-width:720px;margin:40px auto;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial}</style>
</head>
<body>
  <h1>Pagamento Concluído ✅</h1>
  <p>Recebemos seu pedido. Em instantes seu plano será liberado.</p>
  <p>Você pode voltar ao <a href="../painel.php">painel</a>. Se o acesso premium ainda não estiver ativo, aguarde alguns segundos e atualize a página (o webhook da Stripe faz a liberação automática).</p>
</body>
</html>

