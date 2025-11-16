# Jogos Phaser Premium (PHP + MySQL + Stripe)

Este repositório contém somente o conteúdo da pasta `public_html` (raiz do site na Hostinger). Ele inclui:

- Login/Cadastro e controle de plano (`free`/`premium`)
- Jogo Phaser protegido em `jogo-premium.php`
- Stripe Checkout + Webhook + Portal + Cancelamento
- Placar em PHP (arquivo JSON)
- SW para cache offline do jogo

## Banco de Dados

1. Crie o banco e importe `sql/schema.sql`.
2. Se a tabela existir, rode `sql/alter_001_add_stripe_cols.sql`.
3. Configure `config.php` com as credenciais.

## Variáveis (hPanel → Ambiente)

- `STRIPE_SECRET_KEY` = sk_test_…/sk_live_…
- `STRIPE_WEBHOOK_SECRET` = whsec_…
- `STRIPE_PRICE_ID` = price_…
- `STRIPE_MODE` = subscription

## Stripe (Dashboard)

1. Crie Produto/Preço “Premium” (mensal BRL).
2. Webhook: `https://SEU-DOMINIO/stripe/webhook.php`
   - Eventos: checkout.session.completed, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted
   - Copie o whsec_… para a variável.
3. Habilite Customer Portal (para `stripe/portal.php`).

## Deploy automático (GitHub Actions)

Este repo suporta deploy por FTP ou SFTP. Configure 1 dos dois conjuntos abaixo (Settings → Secrets and variables → Actions):

FTP (job deploy-ftp):
- `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_PORT` (21), `FTP_DIR` (ex.: `public_html`)
- Opcional: `FTP_PROTOCOL` (`ftps` por padrão)

SFTP (job deploy-sftp):
- `SFTP_HOST`, `SFTP_USERNAME`, `SFTP_PASSWORD`, `SFTP_PORT` (22), `SFTP_DIR`

Ambos os jobs fazem upload do conteúdo do repositório (esta pasta) para o diretório remoto.

## Teste do Fluxo

1. `painel.php` → Cadastre e faça login.
2. `assinar.php` → Checkout → finalize (modo teste).
3. Webhook atualiza o plano; `painel.php` exibe PREMIUM (Stripe: active).
4. Gerencie no `stripe/portal.php` ou cancele em `stripe/cancel.php`.

