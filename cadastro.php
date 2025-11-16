<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome  = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';

    if ($nome === '' || $email === '' || $senha === '') {
        $erro = "Preencha todos os campos.";
    } else {
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $erro = "Já existe uma conta com esse e-mail.";
        } else {
            $hash = password_hash($senha, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)");
            $stmt->execute([$nome, $email, $hash]);
            $sucesso = "Conta criada! Você já pode fazer login.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cadastro</title>
  <link rel="stylesheet" href="assets/styles.css">
  <style>body{max-width:720px;margin:40px auto;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial}</style>
  </head>
<body>
<h1>Cadastro</h1>

<?php if (!empty($erro)): ?>
  <p style="color:red;">
    <?= htmlspecialchars($erro) ?>
  </p>
<?php endif; ?>

<?php if (!empty($sucesso)): ?>
  <p style="color:green;">
    <?= htmlspecialchars($sucesso) ?>
  </p>
<?php endif; ?>

<form method="post">
  <p><label>Nome:<br><input type="text" name="nome" required></label></p>
  <p><label>E-mail:<br><input type="email" name="email" required></label></p>
  <p><label>Senha:<br><input type="password" name="senha" required></label></p>
  <button type="submit">Cadastrar</button>
  <a href="login.php" style="margin-left:12px">Já tenho conta</a>
  <a href="painel.php" style="margin-left:12px">Voltar</a>
  </form>
</body>
</html>

