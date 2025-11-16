<?php
// config.php
// Inicia a sessão e configura a conexão com o MySQL via PDO
session_start();

$host = 'localhost';
$db   = 'sistema_jogos';
$user = 'USUARIO_DO_BANCO';
$pass = 'SENHA_DO_BANCO';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die('Erro na conexão: ' . $e->getMessage());
}

// Configurações Stripe (use variáveis de ambiente no painel da Hostinger, se possível)
$STRIPE_SECRET_KEY    = getenv('STRIPE_SECRET_KEY') ?: 'sk_live_xxx_coloque_aqui';
$STRIPE_WEBHOOK_SECRET= getenv('STRIPE_WEBHOOK_SECRET') ?: 'whsec_xxx_coloque_aqui';
$STRIPE_PRICE_ID      = getenv('STRIPE_PRICE_ID') ?: 'price_xxx_coloque_aqui';
$STRIPE_MODE          = getenv('STRIPE_MODE') ?: 'subscription'; // 'subscription' ou 'payment'

