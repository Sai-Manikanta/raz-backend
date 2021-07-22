const express = require('express');
const Razorpay = require('razorpay');
const shortid = require('shortid');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
	key_id: 'rzp_live_lVEs73zpgsvlNu',
	key_secret: 'nIGYhZOAdYPJIqsJohnIbx1q'
})

app.get('/', (req, res) => {
	res.status(200).send('Hello world')
})

app.post('/verification', (req, res) => {
	const secret = 'Susheela333';

	console.log(req.body);

	const crypto = require('crypto');

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		//require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4));
		console.log(req.body);
	} else {
		// pass it
	}

	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
    const payment_capture = 1
	const amount = 5
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`app listening on http://localhost:${PORT}`))