const Product = require('../models/product.model');
const fs = require('fs');

const addProduct = async (req, res) => {
    try {
        const { name, quantity, price } = req.body;
        const image = req.file?.path;

        if (!name || !image) {
            return res.status(400).json({ success: false, message: 'Name and Image are required' });
        }
        if (quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
        }
        if (price < 0) {
            return res.status(400).json({ success: false, message: 'Price must be non-negative' });
        }

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ success: false, message: 'Product with this name already exists' });
        }

        const product = await Product.create({ name, quantity, price, image, isDeleted: false });
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        if (image) {
            try {
                await fs.promises.unlink(image);
            } catch (unlinkErr) {
                console.error('Failed to delete image:', unlinkErr);
            }
        }
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, quantity, price } = req.body;
        const newImage = req.file?.path;

        const product = await Product.findById(req.params.id);
        if (!product) {
            if (newImage) await fs.promises.unlink(newImage);
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.name = name || product.name;
        product.quantity = quantity >= 1 ? quantity : product.quantity;
        product.price = price >= 0 ? price : product.price;
        if (newImage) product.image = newImage;

        await product.save();
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        if (newImage) {
            try {
                await fs.promises.unlink(newImage);
            } catch (unlinkErr) {
                console.error('Failed to delete image:', unlinkErr);
            }
        }
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const softDeleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product marked as unavailable', data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    softDeleteProduct
};