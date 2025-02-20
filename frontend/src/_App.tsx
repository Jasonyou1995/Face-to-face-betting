import { useState } from "react";
import * as xrpl from "xrpl";
import wallet from "@crossmarkio/sdk";
import StringHelper from "./helpers/StringHelper";
import ImageLogo from "./assets/images/logo.png";
import ImageXRPL from "./assets/images/xrpl.png";

function App() {
	const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
	const [openStep1, setOpenStep1] = useState(false);
	const [openStep2, setOpenStep2] = useState(false);
	const [openStep3, setOpenStep3] = useState(false);
	// const [openStep4, setOpenStep4] = useState(false);
	// const [openStep5, setOpenStep5] = useState(false);
	const [bettingMenu, setBettingMenu] = useState("");
	const [address, setAddress] = useState("");
	const [xrpBalance, setXrpBalance] = useState("");
	const [rlusdBalance, setRlusdBalance] = useState("");

	const connectWallet = async () => {
		const isDetected = await wallet.async.detect();
		if (isDetected) {
			const { response } = await wallet.methods.signInAndWait();
			setAddress(response.data.address);
			// get XRP balance & RLUSD balance
			await client.connect();
			const resXRPBalance = await client.request({
				command: "account_info",
				account: response.data.address,
				ledger_index: "validated",
			});
			const accountLines = await client.request({
				command: "account_lines",
				account: response.data.address,
				ledger_index: "validated",
			});
			const xrpBalance = String(Number(resXRPBalance?.result?.account_data?.Balance) / 1000000);
			const rlusdBalance = String(accountLines.result.lines.find((line) => line.currency === "524C555344000000000000000000000000000000")?.balance || 0);
			setXrpBalance(xrpBalance);
			setRlusdBalance(rlusdBalance);
			client.disconnect();
		} else {
			alert("You need to install 'Crossmark Wallet'!");
			window?.open("https://chromewebstore.google.com/detail/crossmark-wallet/canipghmckojpianfgiklhbgpfmhjkjg", "_blank")?.focus();
		}
	};
	const createBetting = async () => {
		// setBettingMenu("CREATE");
	};
	const joinBetting = async () => {
		// setBettingMenu("JOIN");
	};

	// const setTrustLine = async () => {
	// 	const { request, response, createdAt, resolvedAt } = await wallet.async.signAndSubmitAndWait({
	// 		TransactionType: "TrustSet",
	// 		Account: address,
	// 		LimitAmount: {
	// 			currency: "524C555344000000000000000000000000000000",
	// 			issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV",
	// 			value: "1000000",
	// 		},
	// 	});
	// 	console.log(request, response, createdAt, resolvedAt);
	// };

	// const sendRLUSD = async () => {
	// 	const { request, response, createdAt, resolvedAt } = await wallet.async.signAndSubmitAndWait({
	// 		TransactionType: "Payment",
	// 		Account: address,
	// 		Destination: "r3E17pLxMvT8owyDJvQFEhjitHHKy4DM2a",
	// 		Amount: {
	// 			currency: "524C555344000000000000000000000000000000",
	// 			issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV",
	// 			value: "1",
	// 		},
	// 	});
	// 	console.log(request, response, createdAt, resolvedAt);
	// };

	return (
		<div className="container px-4">
			<div className="mt-4 flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<img src={ImageLogo} alt="App Logo" className="w-20" />
					<div>
						<div className="text-2xl font-bold">F2F Betting</div>
						<div className="flex items-center text-sm">
							<span className="pr-1">Bet on top of</span>
							<a href="https://xrpl.org/" target="_blank" rel="noreferrer noopener">
								<img src={ImageXRPL} className="img-xrpl" alt="XRPL" />
							</a>
						</div>
					</div>
				</div>
				{!address ? (
					<button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer">
						Connect Wallet
					</button>
				) : (
					<button className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded-full">{StringHelper.shortenAddress(address)}</button>
				)}
			</div>
			<div className="my-8">
				<div className="mb-4">
					<h1 className="text-2xl font-bold">Welcome to F2F Betting!</h1>
					<p className="text-justify italic">
						A simple peer-to-peer betting platform where users can place bets against each other using RLUSD, with smart contracts handling escrow and payouts. We build the solution on top
						of the XRPL technology.
					</p>
				</div>
				<p className="mb-1 text-xl font-bold">Please follow this simple step to participate:</p>
				<ol className="border rounded-xl bg-white">
					<li className="border-b px-4 py-2">
						<div className="text-xl font-bold cursor-pointer" onClick={() => setOpenStep1(!openStep1)}>
							1. Connect Wallet
						</div>
						<div className={openStep1 ? "" : "hidden"}>
							<p className="mb-2">Please connect your wallet to use the app!</p>
							{!address ? (
								<div className="mx-auto text-center">
									<button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer">
										Connect Wallet
									</button>
								</div>
							) : (
								<>
									<div>
										<div className="font-bold">Wallet address:</div>
										<div className="italic">{address}</div>
									</div>
									<div className="mt-2">
										<div className="font-bold">XRP balance:</div>
										<div className="italic">{xrpBalance ? `${xrpBalance} XRP` : "..."}</div>
									</div>
									<div className="mt-2">
										<div className="font-bold">RLUSD balance:</div>
										<div className="italic">{rlusdBalance ? `${rlusdBalance} RLUSD` : "..."}</div>
									</div>
									{/* <div>
										<div className="mt-2 gap-x-4">
											<button onClick={setTrustLine} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer">
												Set TrustLine
											</button>
											<button onClick={sendRLUSD} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer">
												Send RLUSD
											</button>
										</div>
									</div> */}
								</>
							)}
						</div>
					</li>
					<li className="border-b px-4 py-2">
						<div className="text-xl font-bold cursor-pointer" onClick={() => setOpenStep2(!openStep2)}>
							2. Create or join a betting
						</div>
						<div className={openStep2 ? "" : "hidden"}>
							<p className="mb-2">Choose to create a betting or join a betting</p>
							{!address ? (
								<div className="py-4 text-lg text-center font-medium">Please connect your wallet to continue!</div>
							) : (
								<div>
									<div className="flex items-center gap-x-2">
										<button
											onClick={() => setBettingMenu("CREATE")}
											className={"bg-green-500 text-white font-bold py-2 px-4 rounded-xl cursor-pointer " + (bettingMenu === "CREATE" ? "opacity-50" : "")}
										>
											Create a betting
										</button>
										<button
											onClick={() => setBettingMenu("JOIN")}
											className={"bg-yellow-500 text-white font-bold py-2 px-4 rounded-xl cursor-pointer " + (bettingMenu === "JOIN" ? "opacity-50" : "")}
										>
											Join a betting
										</button>
									</div>
									<div className="my-2">
										{bettingMenu === "CREATE" && (
											<form onSubmit={createBetting}>
												<textarea className="min-h-20 w-full py-2 px-4 border rounded-lg" placeholder="Enter Your Question"></textarea>
												<input className="w-full py-2 px-4 border rounded-lg" placeholder="Enter Your Answer" />
												<button type="submit" className="mt-2 w-full bg-green-500 text-white font-bold py-2 px-4 rounded-xl cursor-pointer">
													Process create a betting
												</button>
											</form>
										)}
										{bettingMenu === "JOIN" && (
											<form onSubmit={joinBetting}>
												<input className="w-full py-2 px-4 border rounded-lg" placeholder="Enter Betting ID" />
												<button type="submit" className="mt-2 w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-xl cursor-pointer">
													Process join a betting
												</button>
											</form>
										)}
									</div>
								</div>
							)}
						</div>
					</li>
					<li className="px-4 py-2">
						<div className="text-xl font-bold cursor-pointer" onClick={() => setOpenStep3(!openStep3)}>
							3. Showing the betting result
						</div>
						<div className={openStep3 ? "" : "hidden"}>
							{!address ? (
								<div className="py-4 text-lg text-center font-medium">Please connect your wallet to continue!</div>
							) : (
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							)}
						</div>
					</li>
					{/* <li className="border-b px-4 py-2">
						<div className="text-xl font-bold cursor-pointer" onClick={() => setOpenStep3(!openStep3)}>
							3. Participate in the betting
						</div>
						<div className={openStep3 ? "" : "hidden"}>
							{!address ? (
								<div className="py-4 text-lg text-center font-medium">Please connect your wallet to continue!</div>
							) : (
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							)}
						</div>
					</li> */}
					{/* <li className="px-4 py-2">
						<div className="text-xl font-bold cursor-pointer" onClick={() => setOpenStep4(!openStep4)}>
							4. Showing the betting result
						</div>
						<div className={openStep4 ? "" : "hidden"}>
							{!address ? (
								<div className="py-4 text-lg text-center font-medium">Please connect your wallet to continue!</div>
							) : (
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							)}
						</div> */}
					{/* <li className="border-b px-4 py-2">
						<div className="text-xl font-bold cursor-pointer" onClick={() => setOpenStep4(!openStep4)}>
							4. Validate the betting
						</div>
						<div className={openStep4 ? "" : "hidden"}>
							{!address ? (
								<div className="py-4 text-lg text-center font-medium">Please connect your wallet to continue!</div>
							) : (
								<p>Ask the user to interact with ai agent to get the truth from ai surrounding</p>
							)}
						</div>
					</li>
					<li className="px-4 py-2">
						<div className="text-xl font-bold cursor-pointer" onClick={() => setOpenStep5(!openStep5)}>
							5. Showing the betting result
						</div>
						<div className={openStep5 ? "" : "hidden"}>
							{!address ? (
								<div className="py-4 text-lg text-center font-medium">Please connect your wallet to continue!</div>
							) : (
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							)}
						</div>
					</li> */}
				</ol>
			</div>
		</div>
	);
}

export default App;
