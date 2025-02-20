function shortenAddress(str: string) {
	if (str.length <= 12) return str; // If string is too short, return as is
	return str.slice(0, 6) + "..." + str.slice(-6);
}

const StringHelper = {
	shortenAddress,
};

export default StringHelper;
