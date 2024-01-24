const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(__dirname + '/dist'))
const port = process.env.PORT || 7080;

app.get("/", async () => { })
app.get("/parcel", async () => "Parcel");

app.listen(port);
console.log('Server started at http://localhost:' + port);