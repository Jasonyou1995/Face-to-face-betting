# PlayCheck: In-Person Betting App with AI Verification

![Logo]("img/logo.jpg")

Overview

This application facilitates offline, in-person betting between two players who want to make a wager based on an agreed-upon rule or policy. The app integrates AI-powered agents for ensuring fairness, verifying the outcome, and handling data collection via video, audio, or text inputs. The blockchain component ensures secure transactions, using RLUSD on the XRP Ledger.

Features
	•	Bet Creation & Rule Verification: Player A creates the betting rule or policy. The app ensures that the rules are clear and fair before both players agree to participate.
	•	Stake Funds: Both players agree on an amount to stake for the bet, and the app ensures that the funds are securely locked.
	•	AI Verification: The AI agent collects data (via video, audio, or text) to verify the outcome of the bet in real-time. This agent ensures fairness and objectivity, handling all forms of dispute resolution.
	•	Ethical Betting: All betting scenarios must be ethical and focused on truth-finding from the surroundings. Example: “How many cars of a specific color will pass by in the next 5 minutes?”.
	•	Blockchain Integration: Using RLUSD and XRP Ledger for transparent and secure transactions.
	•	Winning and Payout: The winning player collects the funds after the bet is resolved and verified by the AI agent.

Architecture

Blockchain:
	•	RLUSD: Used as the stablecoin to stake funds for betting.
	•	XRP Ledger: Powers the transaction mechanism to securely hold and release funds.

AI Agents:
	•	The app includes AI agents designed to ensure game fairness and verify the betting outcome by collecting relevant data.
	•	Data Collection: The AI agent may collect data from the environment via video, audio, or text inputs to determine the result.
	•	Identity Verification (Future Work): A Zero-Knowledge Proof (ZKP) approach will be implemented for identity verification in future versions, ensuring privacy and security for users.


How It Works
	1.	Start a Bet: Two players meet in person and agree on a unique betting rule (e.g., predicting an event or counting something).
	2.	Agree to Terms: One player proposes a betting rule, which is then verified and refined for fairness.
	3.	Stake Funds: Both players stake an agreed amount of funds, which are locked via the blockchain.
	4.	AI Data Collection: The AI agent collects data from the environment (video, audio, or text) to verify the outcome. The agent checks the outcome based on the agreed rules.
	5.	Verify the Result: The AI agent ensures fairness and transparency by verifying the result of the bet.
	6.	Claim Funds: The winning player claims the funds, which are automatically released via the blockchain.

Technologies Used
	•	Blockchain: RLUSD, XRP Ledger
	•	AI: AI agent for game fairness and verification (video, audio, and text data collection)
	•	Zero-Knowledge Proofs (ZKP) (Future Work)
	•	Trusted Execution Environments (TEE) (Future Work)


Contributing

We welcome contributions! Please feel free to fork the repository and submit pull requests. Here’s how you can help:
	•	Report bugs or suggest features
	•	Contribute code or improvements
	•	Help with documentation
