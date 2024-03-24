import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import * as fs from "fs";
import OpenAI from "openai"
import { getSubtitles } from "youtube-captions-scraper";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({
        message: "hello world!",
    });
});

app.post("/", async (req, res) => {
    try {
        const videoID = (req.body.url).split("v=")[1].substring(0, 11);
        console.log({ videoID });

        const transcript = (await getSubtitles({ videoID })).map((e) => e.text).toString();
        console.log({ transcript });

        const completion = await openai.chat.completions.create({
            messages: [
                {role: "system", content: fs.readFileSync("instructions.txt").toString()},
                {role: "user", content: `${transcript}`}
            ],
            model: "gpt-3.5-turbo",
        });

        const results = JSON.parse(completion.choices[0].message.content).flashcards;
        console.log({ results });

        res.status(200).send({
            flashcards: results
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);