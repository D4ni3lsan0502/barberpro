const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Rota para cadastrar cliente
router.post('/clientes', async (req, res) => {
  const { nome, email, telefone } = req.body;
  try {
    const cliente = await Client.create({ nome, email, telefone });
    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', cliente });
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err);
    res.status(500).json({ message: 'Erro ao cadastrar cliente' });
  }
});

// Rota para listar clientes
router.get('/clientes', async (req, res) => {
  try {
    const clientes = await Client.find();
    if (!clientes || clientes.length === 0) {
      return res.status(404).json({ message: 'Nenhum cliente encontrado' });
    }
    res.json(clientes);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ message: 'Erro ao buscar clientes' });
  }
});

module.exports = router;
