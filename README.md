<div align="center">

# Sky Platforms — Phaser 3

Jogo de plataforma 2D, rápido, responsivo e instalável (PWA).

[![Deploy Pages](https://github.com/LuizRMSilva1973/jogos-phaser/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/LuizRMSilva1973/jogos-phaser/actions/workflows/deploy-pages.yml)
[![Release](https://github.com/LuizRMSilva1973/jogos-phaser/actions/workflows/release.yml/badge.svg)](https://github.com/LuizRMSilva1973/jogos-phaser/actions/workflows/release.yml)

🎮 Jogue agora: https://luizrmsilva1973.github.io/jogos-phaser/

</div>

## Destaques
- Física arcade com pulos, colisões e coleta de estrelas
- Bombas reativas quando o nível é limpo (desafio crescente)
- Telas: Menu, Jogo, Placar e Enviar Pontuação
- Placar local via API simples (`/api/scores`) com persistência em `scores.json`
- PWA (manifest + service worker): instalável e cache básico
- Responsivo para desktop e mobile (teclado e toque)

## Como jogar
- Teclado: ← → para mover, ↑ ou Espaço para pular, `P` para pausar
- Toque: botões virtuais exibidos no mobile
- Colete estrelas para pontuar; ao limpar o nível, bombas aparecem — desvie!

## Executar localmente
```
npm install
npm run start:5173
# Abra http://localhost:5173
```
Escolha outra porta se preferir: `npm run start:8081`.

## API do placar
- GET `/api/scores` → Retorna top 10 (ordenado)
- POST `/api/scores` → `{ name: string, score: number }`
  - Os dados ficam em `scores.json` na raiz do projeto

## Estrutura
- `index.html` — Entrada e boot do jogo
- `styles.css` — Estilo da página e canvas
- `lib/phaser.min.js` — Phaser 3 local
- `src/main.js` — Configuração base (tamanho, física, cenas)
- `src/scenes/*` — Cenas: Boot, Menu, Game, Scoreboard, SubmitScore
- `server.js` — Servidor Express + endpoints do placar
- `manifest.webmanifest` e `sw.js` — PWA

## Deploy
- GitHub Pages: automatizado via Actions a cada push na `main`.
- Hospedagem estática (Hostinger, etc.): envie os arquivos mantendo a estrutura.

## Roadmap (idéias)
- Mais fases, inimigos e power-ups
- Efeitos sonoros e trilha
- Leaderboard global (servidor remoto)

—
Se curtir, marque a ⭐ e compartilhe. Sugestões são bem-vindas!
