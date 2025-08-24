const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  console.log('--- Middleware "protect" acionado ---');
  console.log('Headers de autorização:', req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extraído:', token);

      if (!process.env.JWT_SECRET) {
          console.error('ERRO CRÍTICO: JWT_SECRET não está definido no ficheiro .env!');
          return res.status(500).json({ message: 'Erro de configuração no servidor.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decodificado com sucesso. ID do utilizador:', decoded.id);

      req.user = await User.findById(decoded.id).select('-password');
      console.log('Utilizador encontrado na base de dados:', req.user.name);
      
      next();
    } catch (error) {
      console.error('!!! ERRO AO VERIFICAR O TOKEN !!!:', error.name, error.message);
      res.status(401).json({ message: 'Não autorizado, o token falhou.' });
    }
  }

  if (!token) {
    console.log('Nenhum token encontrado na requisição.');
    res.status(401).json({ message: 'Não autorizado, sem token.' });
  }
};

const admin = (req, res, next) => {
  console.log('--- Middleware "admin" acionado ---');
  if (req.user && req.user.isAdmin) {
    console.log('Verificação de admin: SUCESSO. O utilizador é um administrador.');
    next();
  } else {
    console.log('Verificação de admin: FALHA. O utilizador não é um administrador ou não foi encontrado.');
    res.status(401).json({ message: 'Não autorizado como administrador.' });
  }
};

module.exports = { protect, admin };