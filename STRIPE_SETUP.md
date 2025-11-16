# Guia Detalhado de Configuração Stripe

Este projeto já possui os endpoints PHP necessários para checkout, portal do cliente, cancelamento e webhook do Stripe. Use este passo a passo para preparar uma conta e preencher as variáveis de ambiente.

## 1) Criar Produto e Preço
1. No Dashboard do Stripe, acesse **Produtos → Adicionar produto**.
2. Nome sugerido: `Premium`.
3. Defina um **Preço recorrente** (p. ex. BRL mensal) e marque como **Assinatura**. Memorize o `price_...` gerado.

## 2) Variáveis de Ambiente (hPanel → Ambiente)
Preencha as seguintes chaves conforme o dashboard/CLI do Stripe:
- `STRIPE_SECRET_KEY`: chave secreta `sk_test_...` ou `sk_live_...`.
- `STRIPE_WEBHOOK_SECRET`: segredo do webhook `whsec_...`.
- `STRIPE_PRICE_ID`: ID do preço criado (`price_...`).
- `STRIPE_MODE`: mantenha `subscription` para assinaturas.

As variáveis são lidas em `config.php` e usadas por `stripe/checkout.php`, `stripe/webhook.php`, `stripe/portal.php` e `stripe/cancel.php`.

## 3) Webhook
1. Crie um endpoint em **Developers → Webhooks** apontando para:
   - `https://SEU-DOMINIO/stripe/webhook.php`
2. Adicione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. Copie o `whsec_...` do endpoint para `STRIPE_WEBHOOK_SECRET`.

## 4) Customer Portal
Ative o Portal do Cliente em **Billing → Customer portal** e permita gerenciamento de plano/cancelamento. O projeto aponta para `stripe/portal.php`.

## 5) Teste do Fluxo
1. Acesse `painel.php`, cadastre-se e faça login.
2. Em `assinar.php`, finalize o checkout (modo teste) com cartão de teste.
3. Confirme na lista de assinaturas do Stripe que o cliente está `active`.
4. Verifique o banco: a coluna de plano deve ser `premium` e o status `active` após o webhook.

## 6) Stripe CLI (opcional)
Para testar localmente sem painel:
```sh
# Inicie um listener e capture o segredo do webhook
stripe listen --forward-to localhost:8000/stripe/webhook.php

# Crie uma sessão de checkout de assinatura
stripe checkout sessions create \
  --mode subscription \
  --customer "cus_xxx" \
  --line-items price="price_xxx",quantity=1 \
  --success-url "http://localhost:8000/stripe/sucesso.php?session_id={CHECKOUT_SESSION_ID}" \
  --cancel-url "http://localhost:8000/stripe/cancelado.php"
```

> Observação: este repositório não consegue criar recursos automaticamente no Stripe; siga os passos acima diretamente no dashboard ou com a Stripe CLI.
