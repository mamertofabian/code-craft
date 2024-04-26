const fs = require("fs");
const Anthropic = require("@anthropic-ai/sdk");
require("dotenv/config");

const prompt = `Here is some code that needs to be refactored and converted to TypeScript:

<code>
{$CODE}
</code>

Please carefully review this code and think through how to refactor it step-by-step. 
Write out your thought process in a <scratchpad> block.

Key things to consider:
- Converting the code to TypeScript, adding type annotations where appropriate
- Cleaning up and simplifying any repetitive or unnecessary code
- Breaking the code into smaller, more manageable components and functions where it makes sense to do so
- Improving the naming of variables and functions to enhance clarity
- Adding comments to explain complex or non-obvious parts of the code

After you've thought it through, please output the fully refactored code, converted to TypeScript,
in a <refactored_code> block. Make sure to break it into clear components and add plenty of
comments.`;

async function refactor() {
	const filePath = "./data/old-code.txt";
	const code = fs.readFileSync(filePath, "utf8");
	const promptWithCode = prompt.replace("{$CODE}", code);

	const anthropic = new Anthropic({
		apiKey: process.env.ANTHROPIC_API_KEY,
	});

	const messages = [
		{
			role: "user",
			content: [
				{
					type: "text",
					text: promptWithCode,
				},
			],
		},
	];

	console.log("Sending code to Claude for refactoring...");
	const response = await anthropic.messages.create({
		model: process.env.CLAUDE_MODEL_ID,
		max_tokens: 4096,
		temperature: 0,
		messages: messages,
	});

	const refactoredCode = response.content[0].text;
	fs.writeFileSync("./data/refactored-code.txt", refactoredCode);

	console.log("Refactored code saved to data/refactored-code.txt");
}

refactor().then(() => console.log("Done!"));
