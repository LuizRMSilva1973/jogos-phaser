# v1.0.0 — Release inicial

Bem-vindo ao lançamento inicial do jogo de plataforma 2D feito com Phaser 3. Esta versão estável inclui jogabilidade completa, placar local, PWA e publicação automática no GitHub Pages.

## Destaques
- Jogo responsivo (desktop e mobile) com física arcade
- Coleta de estrelas, bombas dinâmicas e sistema de pontuação
- Telas: Menu, Jogo, Placar e Enviar Pontuação
- API local para placar: `GET/POST /api/scores` (JSON em `scores.json`)
- PWA: `manifest.webmanifest` + `sw.js` (instalável e com cache básico)
- Deploy contínuo no GitHub Pages a cada push na `main`

## Experimente agora
Jogue direto no navegador:

▶️ https://luizrmsilva1973.github.io/jogos-phaser/

## Como rodar localmente
```
npm install
npm run start:5173
# Abra http://localhost:5173
```

## Endpoints do placar
- GET `/api/scores` → Top 10 ordenado por score
- POST `/api/scores` → `{ name: string, score: number }`

Bom jogo! Qualquer feedback é bem-vindo.
