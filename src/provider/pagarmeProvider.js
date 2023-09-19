require("dotenv").config();
const pagarme = require("pagarme");
const { cpf } = require("cpf-cnpj-validator");

async function process({
	transactionCode,
	total,
	paymentType,
	installments,
	creditCard,
	customer,
	billing,
	items,
}) {
	const billetParams = {
		payment_method: "boleto",
		amount: total * 100,
		installments: 1,
	};

	const creditCardParams = {
		payment_method: "boleto",
		amount: total * 100,
		installments,
		card_holder_name: creditCard.holdername,
		card_number: creditCard.number.replace(/[^?0-9]/g, ""),
		card_expiration_date: creditCard.expiration.replace(/[^?0-9]/g, ""),
		card_cvv: creditCard.cvv,
		capture: true,
	};

	let paymentParams;

	switch (paymentType) {
		case "credit_card":
			paymentParams = creditCardParams;
			break;

		case "billet":
			paymentParams = billetParams;
			break;

		default:
			throw `PaymentType ${paymentType} not found`;
	}

	const customerParams = {
		customer: {
			external_id: customer.email,
			name: customer.name,
			email: customer.email,
			type: cpf.isValid(customer.document) ? "individual" : "corporation",
			country: "br",
			phone_numbers: [customer.mobile],
			documents: [
				{
					type: cpf.isValid(customer.document) ? "cpf" : "cnpj",
					number: customer.document.replace(/[^?0-9]/g, ""),
				},
			],
		},
	};

	const billingParams = billing?.zipcode
		? {
				billing: {
					name: "Billing Address",
					address: {
						country: "br",
						state: billing.state,
						city: billing.city,
						neighborhood: billing.neighborhood,
						street: billing.address,
						street_number: billing.number,
						zipcode: billing.zipcode.replace(/[^?0-9]/g, ""),
					},
				},
		  }
		: {};

	const itemsParams =
		items && items.length > 0
			? {
					items: items.map((item) => ({
						id: item?.id.toString(),
						title: item?.title,
						unit_price: item?.amount * 100,
						quantity: item?.quantity || 1,
						tangible: false,
					})),
			  }
			: {
					items: [
						{
							id: "1",
							title: `t-${transactionCode}`,
							unit_price: total * 100,
							quantity: 1,
							tangible: false,
						},
					],
			  };

	const metadataParams = {
		metadata: {
			transaction_code: transactionCode,
		},
	};

	const transactionParams = {
		async: false,
		...paymentParams,
		...customerParams,
		...billingParams,
		...itemsParams,
		...metadataParams,
	};

	const client = await pagarme.client.connect({
		api_key: process.env.PAGARME_API_KEY,
	});

	const response = await client.transactions.create(transactionParams);

	console.debug("response", response);

	return {
		transactionId: response.id,
		status: this.translateStatus(response.status),
		billet: {
			url: response.boleto_url,
			barCode: response.boleto_barcode,
		},
		card: {
			id: response.card?.id,
		},
		processorResponse: JSON.stringify(response),
	};
}

module.exports = {
	process,
};
