import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pipedrive from '@pipedrive/app-extensions-sdk';
import dotenv from 'dotenv';
import Token from './token.model.js';
import { getAccessToken } from './utill.js';

dotenv.config();

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

// File path setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoints
app.get('/modal', async (req, res) => {
    try {
        const token = await Token.findOne({ where: { apiDomain: 'https://salesautomotors.pipedrive.com' }, rejectOnEmpty: true })
        if (!token || Date.now() > token.expiresIn) {
            console.log(token);
            await refreshAccessToken(token.refreshToken);
        }

        // Pipedrive setup
    } catch (error) {
        console.error(error);
    }

    res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
    console.log('form');
});

app.get('/auth/callback', async (req, res) => {
    const authCode = req.query.code;
    console.log(req.query);

    if (!authCode) {
        return res.status(400).send('Authorization code missing');
    }

    try {
        const data = await getAccessToken(authCode);

        const tokenInst = await Token.create({
            token: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: Date.now() + data.expires_in * 1000,
            domain: data.api_domain
        });

        console.log('tokens saved:', tokenInst);
        res.redirect('/');
    } catch (error) {
        console.error('Error fetching tokens:', error);
    }
});

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});
