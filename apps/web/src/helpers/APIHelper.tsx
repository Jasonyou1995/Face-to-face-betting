function getAIResponse() {
	return (
		<div className="mt-2">
			<b>Game Rules for Offline Betting App</b>
			<br />
			1. <b>Objective</b>: Bet on whether a randomly selected stranger has a beard or not.
			<br />
			2. <b>Betting</b>: Place a bet of 1 unit. If correct, you win 1 unit (1:1 payout).
			<br />
			3. <b>Fairness</b>: Strangers are selected randomly, and the game is not rigged.
			<br />
			4. <b>Responsible Betting</b>: Set personal betting limits. Avoid chasing losses. Bet only what you can afford to lose.
			<br />
			5. <b>Dispute Resolution</b>: Report disputes within 24 hours. Provide evidence (e.g., photos or timestamps) for review. Decisions are final and based on fairness.
			<br />
			6. <b>Security</b>: Funds are securely stored. Transactions are encrypted to protect your data.
			<br />
			7. <b>Ethics</b>: No personal information about strangers is collected or shared. Respect privacy at all times.
			<br />
			8. <b>Age Restriction</b>: Players must be 18+ to participate.
			<br />
			Play responsibly and enjoy the game!
		</div>
	);
}

const APIHelper = {
	getAIResponse,
};

export default APIHelper;
