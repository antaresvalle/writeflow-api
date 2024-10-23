import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const { APP_CLIENT_ID, APP_CLIENT_SECRET, REDIRECT_URI, PORT } = process.env;

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
    res.send("Welcome to WriteFlow API");
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});