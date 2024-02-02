require('dotenv').config()

const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.static(__dirname + '/dist'))
const port = process.env.PORT || 4000;

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const planItems = new Map([
    [1, {priceId: 'price_1OfJjyAyaaWxy2CsH7LieoXV', name: 'Standard Monthly', method: 'subscription'}],
    [2, {priceId: 'price_1OfJjyAyaaWxy2CsH7LieoXV', name: 'Standard Monthly', method: 'subscription'}],
])

app.get("/", async () => { })

app.post('/create-checkout-session', async (req, res) => {
    try {
        const planItem = planItems.get(req.body.items[0].id)
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
            success_url: `${process.env.CLIENT_URL}success.html`,
            cancel_url: `${process.env.CLIENT_URL}cancel.html`
        })
        res.json({url: session.url})
    } catch (e) {
        res.status(500).json({error: e.message })
    }
})

app.listen(port);
console.log('Server started at http://localhost:' + port);