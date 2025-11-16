<?php
// require_premium.php
if (!isset($_SESSION['usuario_id'])) {
    header('Location: login.php');
    exit;
}
if (($_SESSION['usuario_plano'] ?? 'free') !== 'premium') {
    header('Location: painel.php?erro=plano');
    exit;
}

