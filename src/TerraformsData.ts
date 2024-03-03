import { noise3d } from "./PerlinNoise";
import { charsets, fontIds } from "./TerraformsCharacters";
import {
	charsetFontsizes,
	charsetIndices,
	charsetWeights,
	levelDimensions,
	charsetLengths,
	topography,
	alternateColors,
	animatedClasses,
	durations,
} from "./TerraformsDataStorage";
import { tokenZones } from "./TerraformsZones";
import { MAX_SUPPLY } from "./main";

const INIT_TIME = 1700256274;
const TOKEN_DIMS = 32;
const MAX_LEVEL_DIMS = 48;
const STEP = 6619;
const TOTAL_LEVELS = 20;

function heightmapIndexFromTerrainValue(terrainValue: number): number {
	for (let i = 0; i < 8; i++) {
		if (terrainValue > topography[i]) {
			return i;
		}
	}

	return 8; // If no match is found, return 8 (the lowest height value)
}

function perlinPlacement(level, tile, seed, scale) {
	const stepsize = (STEP * TOKEN_DIMS) / levelDimensions[level];

	const refXY = STEP * (14 + (seed + MAX_LEVEL_DIMS / 2) * TOKEN_DIMS) + 3309;

	const result = noise3d(
		refXY + (tile % levelDimensions[level]) * stepsize * scale, // x
		refXY + (tile / levelDimensions[level]) * stepsize * scale, // y
		((level + 1) * TOKEN_DIMS * 2 + seed * TOKEN_DIMS) * STEP * scale, // z
	);

	return result;
}

function zOscillation(level: number, timestamp: number): number {
	let incrementBase = 6;
	let levelIntensifier = 0;
	const daysInCycle = 3650;

	let locationInCycle = Math.floor(
		((timestamp - INIT_TIME) / (24 * 3600 * 1000)) % daysInCycle,
	);

	if (locationInCycle < daysInCycle / 2) {
		if (level > 9) {
			levelIntensifier = level - 9;
		}
	} else {
		incrementBase *= -1;
		locationInCycle -= daysInCycle / 2;
		if (level < 9) {
			levelIntensifier = 9 - level;
		}
	}

	let result = daysInCycle / 4 - locationInCycle;
	if (result < 0) {
		result *= -1;
	}

	result = (daysInCycle / 4 - result) * incrementBase;
	result += (result * levelIntensifier) / 20;
	result = result;

	return result;
}

function tokenElevation(level: number, tile: number, seed: number): number {
	// Assuming perlinPlacement and heightmapIndexFromTerrainValue are functions you have defined
	return (
		4 - heightmapIndexFromTerrainValue(perlinPlacement(level, tile, seed, 1))
	);
}

function xOrigin(level: number, tile: number, seed: number): number {
	const dimensions = levelDimensions[level];

	return (
		STEP *
		TOKEN_DIMS *
		(seed + (MAX_LEVEL_DIMS - dimensions) / 2 + (tile % dimensions))
	);
}

function yOrigin(level: number, tile: number, seed: number): number {
	const dimensions = levelDimensions[level];

	return (
		STEP *
		TOKEN_DIMS *
		(seed + (MAX_LEVEL_DIMS - dimensions) / 2 + tile / dimensions)
	);
}

function zOrigin(
	level: number,
	tile: number,
	seed: number,
	timestamp: number,
): number {
	return (
		(((level + 1) * 7 + seed) * TOKEN_DIMS +
			24 * tokenElevation(level, tile, seed)) *
			STEP +
		zOscillation(level, timestamp)
	);
}

export function pseudoRandom(seed: number): number {
	const prime = 31; // A prime number used in the hashing formula
	let hash = 0;

	// Simple hash function: This is a very basic example and can be replaced with a more robust algorithm
	hash = (seed * prime) ^ (seed >> 15);

	// Normalize the result to a range of 0-99
	return Math.abs(hash % 100);
}

function rotatePlacement(placement: number, seed: number) {
	return (placement + seed) % MAX_SUPPLY;
}

export function levelAndTile(placement: number, seed: number) {
	const rotated = rotatePlacement(placement, seed);
	let cur = 0;
	let last = 0;
	let level = 0;
	let tile = 0;

	for (let levelIndex = 0; levelIndex < TOTAL_LEVELS; levelIndex++) {
		cur += Math.pow(levelDimensions[levelIndex], 2);

		if (rotated < cur) {
			level = levelIndex;
			tile = rotated - last;

			return {
				level,
				tile,
			};
		}
		last = cur;
	}
}

export function resourceLevel(placement, seed) {
	const { level, tile } = levelAndTile(placement, seed);

	const p = perlinPlacement(level, tile, seed, 3);

	return p;
}

export function tokenZone(placement: number, seed: number) {
	const rand = pseudoRandom(placement);

	const zone = placement % tokenZones.length;
	return tokenZones[zone];
}

function characterSet(placement: number, seed: number) {
	const { level } = levelAndTile(placement, seed);

	const rand = pseudoRandom(placement); // Generates a pseudorandom number based on placement

	let index = 0;
	for (let i = 0; i < 9; i++) {
		index += charsetWeights[level][i];
		if (rand < index) {
			// if you want custom charsets and charset lengths, you can use the following code
			let actualIndex = placement % charsets.length;

			//otherwise, you can use the orignal following code
			// let actualIndex = charsetIndices[i] + (rand % charsetLengths[i]);

			const charset = charsets[actualIndex]; // Chars for these chars
			const font = fontIds[actualIndex]; // Font for these chars
			const fontsize = charsetFontsizes[actualIndex]; // Fontsize for these chars
			return { chars: charset, font, fontsize, charsIndex: actualIndex };
		}
	}

	// Return default values if no charset is found (this part might need adjustment)
	return { charset: [], font: 0, fontsize: 0, index: 0 };
}

function tokenTerrain(placement: number, seed: number) {
	let step = STEP;
	const { level, tile } = levelAndTile(placement, seed);

	// Obtain the XYZ origins using respective functions (to be defined)
	let initX = xOrigin(level, tile, seed);
	let yPos = yOrigin(level, tile, seed);
	let zPos = zOrigin(level, tile, seed, Date.now());
	let xPos: number;

	let result = Array.from({ length: TOKEN_DIMS }, () =>
		new Array(TOKEN_DIMS).fill(0),
	);

	for (let y = 0; y < TOKEN_DIMS; y++) {
		xPos = initX; // Reset X for row alignment on each iteration
		for (let x = 0; x < TOKEN_DIMS; x++) {
			result[y][x] = noise3d(xPos, yPos, zPos); // Assuming perlinNoise3d is a function you have for generating Perlin noise
			xPos += step;
		}
		yPos += step;
	}

	return result;
}

function tokenHeightMapIndices(placement: number, seed: number) {
	const values = tokenTerrain(placement, seed);
	const numRows = 32;
	const numCols = 32;
	let result: number[][] = Array.from({ length: numRows }, () =>
		new Array(numCols).fill(0),
	);

	// Convert terrain values to heightmap indices
	for (let y = 0; y < TOKEN_DIMS; y++) {
		for (let x = 0; x < TOKEN_DIMS; x++) {
			result[x][y] = heightmapIndexFromTerrainValue(values[y][x]);
		}
	}

	return result;
}

function getActivation(placement: number, seed: number) {
	const activation = pseudoRandom(placement) % 10000;

	if (activation > 9_990) {
		return "Plague";
	} else {
		return "Cascade";
	}
}

export function generateSvgParams(placement: number, seed: number) {
	const { level, tile } = levelAndTile(placement, seed);

	const resourceLvl = resourceLevel(placement, seed);
	const resourveDirection = 5;
	const { zoneColors, zoneName } = tokenZone(placement, seed);
	const { chars, font, fontsize, charsIndex } = characterSet(placement, seed);

	const heightmapIndices = tokenHeightMapIndices(placement, seed);

	return {
		level,
		tile,
		resourceLvl,
		resourveDirection,
		zoneColors,
		zoneName,
		chars,
		font,
		fontsize,
		charsIndex,
		heightmapIndices,
	};
}

export function generateAnimationParams(placement: number, seed: number) {
	const sorter = pseudoRandom(placement);

	const activation = getActivation(placement, seed);
	let easing = "ms steps(1)";
	let classesAnimated = 0;
	let duration = 0;
	let durationInc = 0;
	let delay = 0;
	let delayInc = 0;
	let bgDelay = 0;
	let bgDuration = 0;
	let altColors: string[] = [];

	if (activation === "Plague") {
		classesAnimated = 876543210;
		duration = 100 + (sorter % 400);
		durationInc = duration;
		if (sorter % 2 === 0) {
			delay = 2000 + (sorter % 2000);
			delayInc = delay;
			bgDelay = delay * 11;
		}
		bgDuration = 50;
		altColors = alternateColors[(sorter / 10) % 7];
	} else {
		if ((sorter / 1000) % 100 < 50) {
			classesAnimated = animatedClasses[2];
		} else if ((sorter / 1000) % 100 < 80) {
			classesAnimated = animatedClasses[1];
		} else {
			classesAnimated = animatedClasses[0];
		}

		// Determine animation speed
		if (sorter % 100 < 60) {
			duration = durations[2];
		} else if (sorter % 100 < 90) {
			duration = durations[1];
		} else {
			duration = durations[0];
		}

		// Determine animation rhythm
		if ((sorter / 10_000) % 100 < 10) {
			delayInc = duration / 10;
		} else {
			if (classesAnimated > 100_000) {
				delayInc = duration / 7;
			} else if (classesAnimated > 10_000) {
				delayInc = duration / 5;
			} else {
				delayInc = duration / 4;
			}
		}

		// Use linear keyframes for all slow animations and for half of
		// medium animations
		if (
			duration == durations[2] ||
			(duration == durations[1] && (sorter / 100) % 100 >= 50)
		) {
			easing = "ms linear alternate both";
		}

		// Add a duration increment to 25% of tokens that are cascade
		// and not fast animations
		if (
			activation == "Cascade" &&
			sorter % 4 == 0 &&
			duration != durations[0]
		) {
			durationInc = duration / 5;
		}
	}

	return {
		activation,
		easing,
		duration,
		durationInc,
		delay,
		delayInc,
		bgDelay,
		bgDuration,
		altColors,
		classesAnimated,
	};
}
