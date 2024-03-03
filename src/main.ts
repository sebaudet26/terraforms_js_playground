import { generateHTML } from "./generateHTML";

export const MAX_SUPPLY = 80;

// DETERMINE HOW MANY LEVELS
const TOTAL_LEVELS = 20;

// JUST TO CAP THE NUMBER OF PIECES FOR TESTING
const MAX_PIECES = 10;

function generateTokenIds() {
	let tokenIds: number[] = [];

	for (let i = 0; i < MAX_SUPPLY; i++) {
		tokenIds.push(i);
	}

	return tokenIds;
}

function generatePlacements() {
	let placements: number[] = [];

	for (let i = 0; i < MAX_SUPPLY; i++) {
		placements.push(i);
	}

	//shuffle placements
	const shuffledPlacements = placements.sort(() => 0.5 - Math.random());

	return shuffledPlacements;
}

const tokenIds = generateTokenIds();
const placements = generatePlacements();

const tokens = tokenIds.map((tokenId, i) => {
	return {
		tokenId,
		placement: placements[i],
	};
});

// Build unique html
tokens.forEach((token, i) => {
	if (i < MAX_PIECES) {
		generateHTML(token);
	}
});
