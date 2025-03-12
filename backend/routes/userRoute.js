import express from "express";
const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

import { OAuth2Client } from "google-auth-library";
import { token } from "morgan";

router.post('/' , async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    
    const redirectUrl = 'http://127.0.0.1:3000/oauth';

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID, 
        process.env.GOOGLE_CLIENT_SECRET, 
        redirectUrl
    );

    const authorizeUrl = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent'
    });

    res.json({ url: authorizeUrl });
});

async function getUserData(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
    const data = await response.json();
    console.log('data', data);
}

router.get('/', async function(req, res, next) {
    const code = req.query.code;
    try {
        const redirectUrl = 'http://127.0.0.1:3000/oauth'
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID, 
            process.env.GOOGLE_CLIENT_SECRET, 
            redirectUrl
        );
        const res = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(res.tokens);
        console.log('Tokens acquired');
        const user = oAuth2Client.credentials;
        console.log('Credentials', user);
        const userData = await getUserData(user.access_token);
        res.json({ tokens: res.tokens, user: userData });
    } catch (error) {
        console.log('Google Sign In Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})