const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

// Função para gerar o token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ROTA: POST /api/auth/register - Registrar um novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado com este e-mail.' });
    }

    const isAdmin = email === 'kukagabriel@hotmail.com';

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválidos.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao registrar usuário.', error: error.message });
  }
});

// ROTA: POST /api/auth/login - Autenticar um usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao fazer login.', error: error.message });
  }
});

// ROTA: GET /api/auth/profile - Obter perfil do usuário (Protegida)
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado.' });
  }
});

// ROTA: PUT /api/auth/profile - Atualizar perfil do usuário (Protegida)
router.put('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Lógica de correção: Garante que o utilizador correto seja sempre admin
    if (user.email === 'kukagabriel@hotmail.com') {
      user.isAdmin = true;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado.' });
  }
});


module.exports = router;