const uuid = require("uuid");
const Cart = require("../models/Cart");
const Transaction = require("../models/Transaction");

const pagarmeProvider = require("../provider/pagarmeProvider");
const paymentProvider = pagarmeProvider;

async function process({
	cartCode,
	paymentType,
	installments,
	customer,
	billing,
	creditCard,
}) {
	const cart = await Cart.findOne({ code: cartCode });

	if (!cart) {
		throw `Cart ${cartCode} was not found`;
	}

	const transaction = await Transaction.create({
		cartCode: cart.code,
		code: await uuid.v4(),
		total: cart.price,
		paymentType,
		installments,
		status: "started",
		customerName: customer.name,
		customerEmail: customer.email,
		customerMobile: customer.mobile,
		customerDocument: customer.document,
		billingAddress: billing.address,
		billingNumber: billing.number,
		billingNeighborhood: billing.neighborhood,
		billingCity: billing.city,
		billingState: billing.state,
		billingZipCode: billing.zipcode,
	});

	const response = paymentProvider.process({
		transactionCode: transaction.code,
		total: transaction.total,
		paymentType,
		installments,
		customer,
		billing,
		creditCard,
	});

	transaction.updateOne({
		transactionId: response.transactionId,
		status: response.status,
		processorResponse: response.processorResponse,
	});

	return response;
}

module.exports = {
	process,
};
