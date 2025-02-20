import { useState } from "react";
import * as xrpl from "xrpl";
import wallet from "@crossmarkio/sdk";
import StringHelper from "./helpers/StringHelper";
import ImageLogo from "./assets/images/logo.png";
import APIHelper from "./helpers/APIHelper";
import { QRCodeSVG } from "qrcode.react";
// import ImageXRPL from "./assets/images/xrpl.png";

function App() {
	const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
	const [openStep1, setOpenStep1] = useState(false);
	const [openStep2, setOpenStep2] = useState(false);
	const [openStep3, setOpenStep3] = useState(false);
	const [bettingMenu, setBettingMenu] = useState("");
	const [address, setAddress] = useState("");
	const [xrpBalance, setXrpBalance] = useState("");
	const [rlusdBalance, setRlusdBalance] = useState("");
	const [bettingID, setBettingID] = useState("");
	const [resultID, setResultID] = useState("");
	const [isBettingVerified, setIsBettingVerified] = useState(false);
	const [isBettingCreated, setIsBettingCreated] = useState(false);
	const [isBettingFound, setIsBettingFound] = useState(false);
	const [isBettingJoined, setIsBettingJoined] = useState(false);
	const [isResultFound, setIsResultFound] = useState(false);

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
	const verifyBetting = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsBettingVerified(true);
	};
	const createBetting = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { response } = await wallet.async.signAndSubmitAndWait({
			TransactionType: "Payment",
			Account: address,
			Destination: "r3E17pLxMvT8owyDJvQFEhjitHHKy4DM2a",
			Amount: {
				currency: "524C555344000000000000000000000000000000",
				issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV",
				value: "1",
			},
		});
		if (response?.data?.meta?.isSuccess) {
			setIsBettingCreated(true);
		}
	};
	const searchBettingID = async () => {
		const isFound = bettingID === "EASYA";
		if (!isFound) alert("Betting ID is not found!");
		setIsBettingFound(isFound);
	};
	const searchResultID = async () => {
		const isFound = resultID === "EASYA";
		if (!isFound) alert("Betting ID is not found!");
		setIsResultFound(isFound);
	};
	const joinBetting = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { response } = await wallet.async.signAndSubmitAndWait({
			TransactionType: "Payment",
			Account: address,
			Destination: "r3E17pLxMvT8owyDJvQFEhjitHHKy4DM2a",
			Amount: {
				currency: "524C555344000000000000000000000000000000",
				issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV",
				value: "1",
			},
		});
		if (response?.data?.meta?.isSuccess) {
			setIsBettingJoined(true);
		}
	};

	return (
		<div className="container px-4">
			<div className="mt-4 flex items-center justify-between">
				<img src={ImageLogo} alt="App Logo" className="h-16" />
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
					<h1 className="text-2xl font-bold">Welcome to Playcheck!</h1>
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
											<>
												{!isBettingCreated && (
													<>
														<form onSubmit={verifyBetting}>
															<textarea className="min-h-40 w-full py-2 px-4 border rounded-lg" placeholder="Enter your betting requirement"></textarea>
															<button type="submit" className="mt-2 w-full bg-cyan-500 text-white font-bold py-2 px-4 rounded-xl cursor-pointer">
																Ask AI to verify the betting rule
															</button>
														</form>
														{isBettingVerified && (
															<>
																{APIHelper.getAIResponse()}
																<form onSubmit={createBetting} className="mt-2">
																	<div className="font-bold">Are you okay with the rules?</div>
																	<input type="text" className="w-full mb-2 py-2 px-4 border rounded-lg" placeholder="Enter Your Answer" />
																	<input type="number" className="w-full mb-2 py-2 px-4 border rounded-lg" placeholder="Enter RLUSD amount to bet" />
																	<button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-xl cursor-pointer">
																		Process create a betting
																	</button>
																</form>
															</>
														)}
													</>
												)}
												{isBettingCreated && (
													<div className="mt-4 mx-auto text-center">
														<QRCodeSVG value="EASYA" className="mx-auto" />
														<p className="mt-2">
															<span>Your Betting ID: </span>
															<span className="font-bold">EASYA</span>
														</p>
													</div>
												)}
											</>
										)}
										{bettingMenu === "JOIN" && (
											<>
												<div className="relative mb-2">
													<input
														type="text"
														className="w-full py-2 px-4 border rounded-lg"
														placeholder="Enter Betting ID"
														value={bettingID}
														onChange={(e) => setBettingID(e.target.value)}
													/>
													<button onClick={searchBettingID} className="absolute rounded-lg bg-gray-200 btn-search">
														Search 🔎
													</button>
												</div>
												{isBettingFound && !isBettingJoined && (
													<form onSubmit={joinBetting}>
														{APIHelper.getAIResponse()}
														<div className="mt-6">
															<div className="font-bold">Betting Amount: 1 RLUSD</div>
															<input type="text" className="w-full mt-2 py-2 px-4 border rounded-lg" placeholder="Enter Your Answer" />
															<button type="submit" className="mt-2 w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-xl cursor-pointer">
																Process join a betting
															</button>
														</div>
													</form>
												)}
												{isBettingJoined && (
													<p className="mt-6 mb-4 text-xl text-center font-bold">
														Congratulation! You have joined the betting.
														<br />
														Please wait the result to show up!
													</p>
												)}
											</>
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
								<>
									<p className="mb-2">Please type in the betting ID to view the result</p>
									<div className="relative mb-2">
										<input
											type="text"
											className="w-full py-2 px-4 border rounded-lg"
											placeholder="Enter Betting ID"
											value={resultID}
											onChange={(e) => setResultID(e.target.value)}
										/>
										<button onClick={searchResultID} className="absolute rounded-lg bg-gray-200 btn-search">
											Search 🔎
										</button>
									</div>
									{isResultFound && (
										<p className="mt-6 mb-4 text-xl text-center">
											The winner is <b>raydD3LaA8wveXy53Ff3De2jL7ViAowz5H</b>
										</p>
									)}
								</>
							)}
						</div>
					</li>
				</ol>
			</div>
		</div>
	);
}

export default App;
