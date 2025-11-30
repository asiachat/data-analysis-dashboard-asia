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
		const { prompt, data } = req.body;
		if (process.env.NODE_ENV !== 'production') {
			console.log('Received /insight request. prompt present:', Boolean(prompt));
			console.log('Request body preview:', JSON.stringify(req.body).slice(0, 200));
		}
		if (!prompt) {
			return res.status(400).json({ error: "Missing prompt in request body" });
		}
		// Build a concise dataset summary instead of dumping entire JSON (saves tokens)
		let datasetSummary = 'No dataset provided.';
		let datasetMeta = {};
		if (Array.isArray(data) && data.length > 0) {
			const MAX_SAMPLE_ROWS = 5;
			const MAX_SUMMARY_CHARS = 6000;
			const MAX_STATS_COLS = 5;

			const rowCount = data.length;
			const sample = data.slice(0, MAX_SAMPLE_ROWS);
			const columns = Object.keys(data[0]);
			const colCount = columns.length;
		const numericColumns = columns.filter(c => data.some(r => typeof r[c] === 'number'));
		const stats = numericColumns.slice(0, MAX_STATS_COLS).map(col => {
			const values = data.map(r => r[col]).filter(v => typeof v === 'number');
			const min = Math.min(...values);
			const max = Math.max(...values);
			const avg = values.reduce((s, n) => s + n, 0) / values.length;
			return `${col}: min=${min}, max=${max}, avg=${avg.toFixed(2)}`;
		});

		// Deterministic insights to prevent AI hallucinations
const monthCol = columns.find(c => c.toLowerCase() === 'month');
const stepsCol = columns.find(c => c.toLowerCase() === 'steps') || numericColumns[0];
let computedInsights = '';
if (stepsCol) {
    const values = data.map(r => ({ row: r, val: r[stepsCol] })).filter(x => typeof x.val === 'number');
    if (values.length > 0) {
        const maxEntry = values.reduce((a, b) => (b.val > a.val ? b : a));
        const minEntry = values.reduce((a, b) => (b.val < a.val ? b : a));
        const maxLabel = monthCol ? maxEntry.row[monthCol] : 'Top row';
        const minLabel = monthCol ? minEntry.row[monthCol] : 'Bottom row';
        const total = values.reduce((sum, x) => sum + x.val, 0);
        const average = total / values.length;
        computedInsights = `\nComputed statistics:\n• Maximum ${stepsCol}: ${maxEntry.val.toLocaleString()} (${maxLabel})\n• Minimum ${stepsCol}: ${minEntry.val.toLocaleString()} (${minLabel})\n• Average ${stepsCol}: ${average.toLocaleString(undefined, { maximumFractionDigits: 0 })}\n• Total ${stepsCol}: ${total.toLocaleString()}`;
    }
}

		datasetSummary = `Rows: ${rowCount}\nColumns (${colCount}): ${columns.join(', ')}\nNumeric columns: ${numericColumns.join(', ') || 'None'}\nStats:\n${stats.map(s => '• ' + s).join('\n')}${computedInsights}\nSample rows:\n${sample.map((r,i) => (i+1)+'. '+JSON.stringify(r)).join('\n')}`;
		const truncated = datasetSummary.length > MAX_SUMMARY_CHARS;
			if (truncated) {
				datasetSummary = datasetSummary.slice(0, MAX_SUMMARY_CHARS) + '\n…(truncated)';
			}
			datasetMeta = { rowCount, colCount, numericColumns, sampleCount: sample.length, truncated };
		}

		const fullPrompt = `You are a helpful data analysis assistant. Use ONLY the dataset summary provided below to answer the user's question. If the question references columns not present, politely clarify. Provide a concise summary plus any anomalies (unusual values, outliers, missing patterns, trends).\n\nUser question: ${prompt}\n\nDataset summary:\n${datasetSummary}`;
		const { object } = await generateObject({
			model: openai("gpt-4o-mini"),
			schema,
			prompt: fullPrompt,
		});
		res.json({ summary: object.summary, anomalies: object.anomalies, meta: datasetMeta });
	} catch (error) {
		// Log detailed error for debugging
		console.error('Insight endpoint error:', error?.stack || error);
		res.status(500).json({ error: "AI call failed", details: error?.message });
	}
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(`AI insight server listening on port ${PORT}`);
	}
});