const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
const SCORES_FILE = path.join(__dirname, 'scores.json');

// Middleware para parsear JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(__dirname));

// Endpoint para obter os scores
app.get('/api/scores', async (req, res) => {
  try {
    const data = await fs.readFile(SCORES_FILE, 'utf8');
    const scores = JSON.parse(data);
    // Ordena do maior para o menor
    scores.sort((a, b) => b.score - a.score);
    res.json(scores.slice(0, 10)); // Retorna apenas o top 10
  } catch (error) {
    // Se o arquivo não existir, retorna um array vazio
    if (error.code === 'ENOENT') {
      return res.json([]);
    }
    res.status(500).json({ message: 'Erro ao ler pontuações.' });
  }
});

// Endpoint para adicionar um novo score
app.post('/api/scores', async (req, res) => {
  try {
    const { name, score } = req.body;

    if (!name || typeof score !== 'number') {
      return res.status(400).json({ message: 'Nome e pontuação são obrigatórios.' });
    }

    let scores = [];
    try {
      const data = await fs.readFile(SCORES_FILE, 'utf8');
      scores = JSON.parse(data);
    } catch (error) {
      // Ignora se o arquivo não existir, ele será criado
      if (error.code !== 'ENOENT') throw error;
    }

    scores.push({ name, score, date: new Date().toISOString() });
    // Mantém a lista ordenada e curta para não crescer indefinidamente
    scores.sort((a, b) => b.score - a.score);
    const updatedScores = scores.slice(0, 100); // Limita a 100 entradas

    await fs.writeFile(SCORES_FILE, JSON.stringify(updatedScores, null, 2));
    res.status(201).json({ message: 'Pontuação salva com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar pontuação.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
