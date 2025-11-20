# Sky Platforms (Phaser 3)

Jogo de plataforma 2D simples, responsivo e pronto para hospedagem estática (ex.: Hostinger). Foi feito com Phaser 3 e não precisa de backend. Todos os gráficos são gerados por código para facilitar distribuição sem arquivos de arte.

## Recursos
- Movimentação com física arcade (pular, colisões, quique)
- Coleta de estrelas e sistema de pontuação
- Bombas aparecem quando todas as estrelas são coletadas
- Tela de menu, pausa (tecla `P`) e game over com reinício
- Suporte a teclado (← → ↑/Espaço) e toque (botões virtuais)
- Escala responsiva (desktop e mobile)

## Estrutura
- `index.html` — Entrada do jogo, carrega Phaser via CDN e inicializa as cenas
- `styles.css` — Estilos básicos e embelezamento do canvas
- `src/main.js` — Configuração do jogo (tamanho, física, cenas)
- `src/scenes/BootScene.js` — Geração de texturas (player, plataformas, itens, botões)
- `src/scenes/MenuScene.js` — Menu inicial e instruções
- `src/scenes/GameScene.js` — Lógica principal do jogo

## Como executar localmente
Como é um site estático, basta abrir no navegador ou usar um servidor estático:

1) Abrir direto: clique duas vezes no `index.html`. Se o navegador bloquear algo por CORS, rode um servidor local.
2) Servidor local (exemplo com Python):

```bash
python3 -m http.server 8080
# Acesse http://localhost:8080
```

Observação: o jogo carrega o Phaser de um CDN público. Para ambiente offline, troque a tag de script por uma cópia local do `phaser.min.js` (baixada previamente) e referencie o arquivo local.

## Publicar na Hostinger
1. Faça login no painel da Hostinger.
2. Vá até o Gerenciador de Arquivos do seu domínio e abra a pasta `public_html`.
3. Envie todos os arquivos e pastas deste projeto mantendo a mesma estrutura (ou use FTP para enviar o diretório inteiro).
4. Depois do upload, acesse seu domínio e teste o jogo.
5. Opcional: force HTTPS no painel para melhor desempenho e segurança.

## Personalização
- Título e descrição: edite no `index.html` (`<title>` e meta `description`).
- Dimensões do jogo: ajuste em `src/main.js` (`baseWidth` e a razão `ratio`).
- Dificuldade: modifique velocidades, gravidade e distribuição de plataformas em `GameScene.js`.
- Artes: todos os sprites são gerados em `BootScene.js`. Altere cores, tamanhos e formatos.
- Texto/idioma: edite strings nas cenas (`MenuScene.js` e `GameScene.js`).

## Licenças e uso comercial
Você pode hospedar e vender o jogo como parte de um pacote, site de jogos ou portal educacional. O Phaser é distribuído sob MIT; ao usar via CDN, você está consumindo a biblioteca como dependência. Não há assets de terceiros neste projeto.

---
Bom jogo! Se quiser, posso adicionar placar online, fases múltiplas, PWA offline, trilha sonora e efeitos.
