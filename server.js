// Importação de pacotes
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Importação de rotas
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart'); // Rota do carrinho importada

// Inicialização do Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permite requisições de diferentes origens (do nosso frontend)
app.use(express.json()); // Permite que o servidor entenda JSON

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado com sucesso!"))
.catch(err => console.error("Erro ao conectar com o MongoDB:", err));

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes); // Rota do carrinho utilizada

// Rota principal
app.get('/', (req, res) => {
  res.send('API do E-commerce no ar!');
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});