import { writeFileSync } from "fs";
import {
	generateAnimationParams,
	generateSvgParams,
	levelAndTile,
	resourceLevel,
} from "./TerraformsData";
import { makeSVG } from "./TerraformsSVG";

const seed = 10196;

function buildHtml(test) {
	var header = "";
	var body = test;

	// concatenate header string
	// concatenate body string

	return (
		"<!DOCTYPE html>" +
		"<html><head>" +
		header +
		"</head><body>" +
		body +
		"</body></html>"
	);
}

export function generateHTML(token) {
	const svgParams = generateSvgParams(token.placement, seed);
	const animationParams = generateAnimationParams(token.placement, seed);
	const { svg } = makeSVG(svgParams, animationParams);

	const html = buildHtml(`${svg}`);

	writeFileSync(`./output/html/${token.tokenId}.html`, `${html}`);
}
