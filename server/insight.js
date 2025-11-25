import "dotenv/config";
import express from "express";
import cors from "cors";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

// Schema describing the object we expect back from the AI generator
// Adjust the fields below to match the shape you expect the AI to return.
const schema = z.object({
	summary: z.string(),
	anomalies: z.array(z.string()).optional(),
});

const app = express();
app.use(cors());
app.use(express.json());


app.post("/insight", async (req, res) => {
	try {
		const { prompt } = req.body;
		console.log('Received /insight request. prompt present:', Boolean(prompt));
		console.log('Request body preview:', JSON.stringify(req.body).slice(0, 200));
		if (!prompt) {
			return res.status(400).json({ error: "Missing prompt in request body" });
		}
		const { object } = await generateObject({
			model: openai("gpt-4o-mini"),
			schema,
			prompt,
		});
		res.json({ summary: object.summary, anomalies: object.anomalies });
	} catch (error) {
		// Log detailed error for debugging
		console.error('Insight endpoint error:', error?.stack || error);
		res.status(500).json({ error: "AI call failed", details: error?.message });
	}
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`AI insight server listening on port ${PORT}`);
});