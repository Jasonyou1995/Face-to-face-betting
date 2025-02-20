# AI Agent summary (draft)

## AI Agent 1: Rule Maker Agent
	1.	Flask Setup: This script includes a basic Flask API setup. When the frontend sends a POST request to the /generate_rules endpoint with a string input, it will process that input as part of the dynamic task for the Rule Maker.
	2.	Dynamic Task: The task that is passed to the Rule Maker agent is dynamically built based on the string input provided by the frontend. The input is incorporated into the task description so that it directly impacts the rule-making process.
	3.	Security (TODO):
	•	API Key: The DEEPSEEK_API_KEY is loaded from environment variables. Ensure the API key is securely managed and not exposed in any public repositories.
	•	Input Validation: The input from the frontend


## AI Agent 2: Verifier Agent