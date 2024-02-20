require('dotenv').config()

const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');
const planListing = require('./plan-data.json');

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.static(__dirname + '/dist'))
const port = process.env.PORT || 4000;

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.get("/", async () => {})

app.post('/create-checkout-session', async (req, res) => {
    try {
        const planItem = planListing[req.body.items[0].id]
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: planItem.method,
            currency: 'usd',
                line_items: [
                    {
                        adjustable_quantity: {
                            enabled: false
                        },
                        price: planItem.priceId,
                        quantity: 1,
                    },
                ],
            success_url: `${process.env.CLIENT_URL}success?payment_id=${req.body.items[0].id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}cancel.html`
        })
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({error: e.message })
    }
})

app.post('/get-payment', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.body.session[0].id);
        res.json({ data: session })
    }
    catch (e) {
        res.status(500).json({ error: e.message })
    }
});

app.post('/get-payment-detail', async (req, res) => {
    try {
        const priceId = planListing[req.body.payment[0].id].priceId
        console.log(priceId)
        const payment = await stripe.prices.retrieve(priceId);
        res.json({ data: payment })
    }
    catch {
        res.status(500).json({ error: e.message })
    }
})

app.listen(port);
console.log('Server started at http://localhost:' + port);