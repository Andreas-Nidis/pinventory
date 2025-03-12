import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import { aj } from "./lib/arcjet.js";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({ secret: process.env.SESSION_SECRET }))
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json()); //Herlps parse incoming data 
app.use(cors()); //Avoid cors errors
app.use(helmet()); //Helmet is a security middleware that helps protect your application by setting HTTP headers.
app.use(morgan("dev")); //This will log requests


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async(accessToken, refreshToken, profile, done) => {
            const user = await findOrCreateUser(profile);
            return done(null, user);
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = getUserById(id);
    done(null, user);
}) 

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    })
})

//Implementation of arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1 //Token consumption per request
        })

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                res.status(429).json({ error: "Too Many Requests" });
            } else if (decision.reason.isBot()) {
                res.status(403).json({ error: "Bot access denied" });
            } else {
                res.status(403).json({ error: "Forbidden" });
            }
            return;
        }

        //Spoofed Bots Check
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed bot detected" });
            return;
        }

        next();
    } catch (error) {
        console.log("Arcjet error", error);
        next(error);
    };
});

app.use("/api/products", productRoutes);

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
})

