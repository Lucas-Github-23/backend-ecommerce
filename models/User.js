const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório.'],
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Por favor, insira um e-mail válido.'],
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres.'],
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  cart: [cartItemSchema], // Adicionado o carrinho ao usuário
}, {
  timestamps: true,
});

// Middleware para criptografar a senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar a senha inserida com a senha no banco de dados
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;