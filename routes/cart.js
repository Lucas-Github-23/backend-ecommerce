const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// ROTA: GET /api/cart - Obter o carrinho do usuário
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o carrinho.', error: error.message });
  }
});

// ROTA: POST /api/cart - Adicionar/Atualizar item no carrinho
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Se o item já existe, atualiza a quantidade
      user.cart[itemIndex].quantity = quantity;
    } else {
      // Se não existe, adiciona o novo item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    const populatedUser = await user.populate('cart.product');
    res.status(200).json(populatedUser.cart);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar item ao carrinho.', error: error.message });
  }
});

// ROTA: DELETE /api/cart/:productId - Remover item do carrinho
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    
    await user.save();
    const populatedUser = await user.populate('cart.product');
    res.status(200).json(populatedUser.cart);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover item do carrinho.', error: error.message });
  }
});

module.exports = router;