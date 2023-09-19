const Cart = require("../models/Cart");

async function index(req, res) {
	try {
		const carts = await Cart.find();

		return res.status(200).json(carts);
	} catch (err) {
		console.error(err);

		return res.status(500).json({ error: "Internal server error" });
	}
}

async function create(req, res) {
	try {
		const { code, price } = req.body;

		const cart = await Cart.create({ code, price });

		return res.status(201).json(cart);
	} catch (err) {
		console.error(err);

		return res.status(500).json({ error: "Internal server error" });
	}
}

async function update(req, res) {
	try {
		const { id } = req.params;
		const { code, price } = req.body;

		const cart = await Cart.findById(id);

		if (!cart) {
			return res.status(404).json();
		}

		await cart.updateOne({ code, price });

		return res.status(200).json();
	} catch (err) {
		console.error(err);

		return res.status(500).json({ error: "Internal server error" });
	}
}

async function detroy(req, res) {
	try {
		const { id } = req.params;

		const cart = await Cart.findById(id);

		if (!cart) {
			return res.status(404).json();
		}

		await cart.deleteOne();

		return res.status(200).json();
	} catch (err) {
		console.error(err);

		return res.status(500).json({ error: "Internal server error" });
	}
}

module.exports = {
	index,
	create,
	update,
	detroy,
};
