import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import * as fs from "fs";
import OpenAI from "openai"
import { YoutubeTranscript } from "youtube-transcript";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
    try {
        const url = req.body.url;
        const transcript = (await YoutubeTranscript.fetchTranscript(url)).map((e) => e.text).toString();

        const completion = await openai.chat.completions.create({
            messages: [
                {role: "system", content: fs.readFileSync("instructions.txt").toString()},
                {role: "user", content: transcript}
            ],
            model: "gpt-3.5-turbo",
        });

        res.status(200).send({
            flashcards: JSON.parse(completion.choices[0].message.content).flashcards
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);