import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); //Herlps parse incoming data 
app.use(cors()); //Avoid cors errors
app.use(helmet()); //Helmet is a security middleware that helps protect your application by setting HTTP headers.
app.use(morgan("dev")); //This will log requests

app.get("/test", (req, res) => {
    console.log(res.getHeaders());
    res.send("Hello from the test route");
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})