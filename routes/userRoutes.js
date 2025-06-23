import express from 'express';
const router = express.Router();

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hash, tipo });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao cadastrar. E-mail pode já estar em uso.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      return res.status(400).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      token,
      user: {
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor ao fazer login.' });
  }
});

export default router;
