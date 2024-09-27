const express = require('express');
const cors = require('cors');
const path = require("path");

require('dotenv').config()

const authConf = {
    clientId: process.env.CLIENT_ID,
    secretId: process.env.CLIENT_SECRET,
    redirectUri: 'https://27ad-95-56-31-10.ngrok-free.app/auth/callback',
    getTokenUrl: `${process.env.AUTH_API}/oauth/token`
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
    console.log("form");
});

app.get('/auth/callback', async (req, res) => {
    const authCode = req.query.code;
    console.log(req.query);

    if (!authCode) {
        return res.status(400).send('Authorization code missing');
    }

    try {
        const response = await fetch(authConf.getTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'authorization_code',
                'code': authCode,
                'client_id': authConf.clientId,
                'client_secret': authConf.secretId,
                'redirect_uri': authConf.redirectUri,
            })
        });

        if (!response.ok) {
            console.log(res);
            throw new Error('Not ok response');
        }

        const data = await response.json(); 

        console.log('tokens saved:', data);
        res.redirect('/');
    } catch (error) {
        console.error('Error fetching tokens:', error);
    }
});

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});
