import Token from "./token.model.js";
import dotenv from 'dotenv';

dotenv.config();

export const authConf = {
    clientId: process.env.CLIENT_ID,
    secretId: process.env.CLIENT_SECRET,
    redirectUri: 'https://salesautomators-test-emve.onrender.com/auth/callback',
    getTokenUrl: `${process.env.AUTH_API}/oauth/token`,
};

export async function getAccessToken(authCode) {
    const response = await fetch(authConf.getTokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'code': authCode,
            'client_id': authConf.clientId,
            'client_secret': authConf.secretId,
            'redirect_uri': authConf.redirectUri,
        }),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error response:', errorMessage);
        return res.status(500).send(`token fetching failed: ${errorMessage}`);
    }

    return response.json();
}

export async function refreshAccessToken(refreshToken) {
    try {
        const response = await fetch(authConf.getTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'grant_type': 'refresh_token',
                'refresh_token': refreshToken,
                'client_id': authConf.clientId,
                'client_secret': authConf.secretId,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json();
        await Token.update(
            {
                token: data.access_token,
                expiresIn: Date.now() + data.expires_in * 1000,
                refreshToken: data.refresh_token || refreshToken, 
            },
            { where: { refreshToken } }
        );
        console.log('Access token refreshed');
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}
