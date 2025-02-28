import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

import "dotenv/config";

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        //Protection against ~ SQL injection, XSS, CSRF attakcs ~
        shield({mode:"LIVE"}),
        detectBot({
            mode:"LIVE",
            //Blocks bots (except search engines)
            allow: [
                "CATEGORY:SERACH_ENGINE"
                //Full list https://arcjet.com/bot-list
            ]
        }),

        //Rate Limiting
        tokenBucket({
            mode:"LIVE",
            refillRate: 5, //Refill 5 tokens per interval
            interval: 10, //Refill every 10 seconds
            capacity: 10 //Bucket capicity is set to 10 tokens
        })
    ]
})