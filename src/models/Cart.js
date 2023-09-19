const mongoose = require("mongoose");

const schema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			// unique: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Cart", schema);
