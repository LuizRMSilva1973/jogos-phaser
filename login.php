<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';

    $stmt = $pdo->prepare("SELECT id, nome, senha_hash, plano FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($senha, $user['senha_hash'])) {
        $_SESSION['usuario_id']    = $user['id'];
        $_SESSION['usuario_nome']  = $user['nome'];
        $_SESSION['usuario_plano'] = $user['plano'];
        header('Location: painel.php');
        exit;
    } else {
        $erro = "E-mail ou senha inválidos.";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login</title>
  <style>body{max-width:720px;margin:40px auto;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial}</style>
</head>
<body>
<h1>Login</h1>

<?php if (!empty($erro)): ?>
  <p style="color:red;">
    <?= htmlspecialchars($erro) ?>
  </p>
<?php endif; ?>

<form method="post">
  <p><label>E-mail:<br><input type="email" name="email" required></label></p>
  <p><label>Senha:<br><input type="password" name="senha" required></label></p>
  <button type="submit">Entrar</button>
  <a href="cadastro.php" style="margin-left:12px">Criar conta</a>
  <a href="painel.php" style="margin-left:12px">Voltar</a>
</form>
</body>
</html>

