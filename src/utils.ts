export function weightedRandom(weights: number[]): number {
	let totalWeight = 0;
	let i = 0;
  let random: number;
	for (i; i < weights.length; i++) totalWeight += weights[i];

	random = Math.random() * totalWeight;

	for (i = 0; i < weights.length; i++) {
		if (random < weights[i]) return i;
		random -= weights[i];
	}

	throw new Error('something went wrong');
};