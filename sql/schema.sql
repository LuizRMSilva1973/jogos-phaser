CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    plano ENUM('free', 'premium') NOT NULL DEFAULT 'free',
    stripe_customer_id VARCHAR(255) DEFAULT NULL,
    stripe_subscription_id VARCHAR(255) DEFAULT NULL,
    stripe_status VARCHAR(50) DEFAULT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
