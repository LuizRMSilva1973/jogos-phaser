<?php
// Endpoint simples para salvar/listar pontuações em arquivo JSON
// Métodos: GET (lista), POST (adiciona { name, score })

header('Content-Type: application/json; charset=utf-8');
$dataDir = __DIR__ . '/../data';
$file = $dataDir . '/scores.json';
if (!is_dir($dataDir)) { mkdir($dataDir, 0775, true); }
if (!file_exists($file)) { file_put_contents($file, json_encode([])); }

function readScores($file) {
    $raw = @file_get_contents($file);
    if ($raw === false) return [];
    $json = json_decode($raw, true);
    return is_array($json) ? $json : [];
}

function writeScores($file, $scores) {
    return (bool) file_put_contents($file, json_encode($scores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'GET') {
    echo json_encode(readScores($file));
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = trim($input['name'] ?? '');
    $score = (int) ($input['score'] ?? 0);
    if ($name === '' || $score <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }
    $scores = readScores($file);
    $scores[] = ['name' => mb_strimwidth($name, 0, 40, '...'), 'score' => $score, 'ts' => time()];
    usort($scores, fn($a, $b) => $b['score'] <=> $a['score']);
    $scores = array_slice($scores, 0, 50);
    writeScores($file, $scores);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);

