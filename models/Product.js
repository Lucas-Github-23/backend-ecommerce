const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome do produto é obrigatório.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A descrição do produto é obrigatória.'],
  },
  price: {
    type: Number,
    required: [true, 'O preço do produto é obrigatório.'],
    min: [0, 'O preço não pode ser negativo.'],
  },
  category: {
    type: String,
    required: [true, 'A categoria do produto é obrigatória.'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'A URL da imagem do produto é obrigatória.'],
  },
  inStock: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true, // Adiciona os campos createdAt e updatedAt
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;