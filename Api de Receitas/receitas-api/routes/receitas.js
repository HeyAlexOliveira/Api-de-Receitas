const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'alexftc', 
    database: 'receitasDB'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM receitas';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar receitas' });
        } else {
            res.json(results);
        }
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM receitas WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar receita' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Receita não encontrada' });
        } else {
            res.json(results[0]);
        }
    });
});

router.get('/buscar/nome', (req, res) => {
    const { nome } = req.query;
    const sql = 'SELECT * FROM receitas WHERE LOWER(nome_receita) LIKE LOWER(?)';
    db.query(sql, [`%${nome.trim()}%`], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar receita' });
        } else {
            res.json(results);
        }
    });
});

router.post('/', (req, res) => {
    const { nome_receita, ingredientes, modo_preparo, tempo_preparo } = req.body;
    const sql = 'INSERT INTO receitas (nome_receita, ingredientes, modo_preparo, tempo_preparo) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome_receita, ingredientes, modo_preparo, tempo_preparo], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao adicionar receita' });
        } else {
            res.status(201).json({ message: 'Receita adicionada com sucesso!', id: results.insertId });
        }
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome_receita, ingredientes, modo_preparo, tempo_preparo } = req.body;
    const sql = 'UPDATE receitas SET nome_receita = ?, ingredientes = ?, modo_preparo = ?, tempo_preparo = ? WHERE id = ?';
    db.query(sql, [nome_receita, ingredientes, modo_preparo, tempo_preparo, id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao atualizar receita' });
        } else {
            res.json({ message: 'Receita atualizada com sucesso!' });
        }
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM receitas WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao deletar receita' });
        } else {
            res.json({ message: 'Receita deletada com sucesso!' });
        }
    });
});

module.exports = router;
