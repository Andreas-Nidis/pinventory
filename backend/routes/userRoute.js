import express from "express";
const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

import { OAuth2Client } from "google-auth-library";

router.post('/' , async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://pern-store-project.onrender.com");
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    
    const redirectUrl = "https://pern-store-project.onrender.com/oauth";

    const oAuth2Client = new OAuth2Client(
        process.env.VITE_GOOGLE_CLIENT_ID, 
        process.env.GOOGLE_CLIENT_SECRET, 
        redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent'
    });

    res.json({ url: authorizeUrl });
});

async function getUserData(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
    const data = await response.json();
    // console.log('data', data);
    return data;
}

router.post('/oauth', async function(req, res, next) {
    const { id_token } = req.body;
    try {
        const oAuth2Client = new OAuth2Client(
            process.env.VITE_GOOGLE_CLIENT_ID, 
            process.env.GOOGLE_CLIENT_SECRET
        );

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: id_token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const userData = await getUserData(id_token);
        res.json({ token: id_token, user: userData });
    } catch (error) {
        console.log('Google Sign In Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;