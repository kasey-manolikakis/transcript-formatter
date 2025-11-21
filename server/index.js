import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.Gemini_API_KEY,
});

app.post("/format", async (req, res) => {
    try{
    const { text } = req.body;

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [text],
        temperature: 0.2,
    });

    res.json({ result: result.text });
    }catch (err){
        console.error(err);
        res.status(500).json({error: err.toString() });

    }
});

app.listen(5001, () => console.log("Server running on port 5001"));