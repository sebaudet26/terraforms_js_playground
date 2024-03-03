import { pseudoRandom } from "./TerraformsData";

const USE_OPEPEN_SHAPE = false;
const ENABLE_PROXIMITY = true;

const classes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const jsString =
	";function map(e,t,r,i,a){return i+(a-i)*(e-t)/(r-t)}RESOURCE/=1e4;let isDaydream=1==MODE||3==MODE,isTerraformed=2==MODE||4==MODE,isOrigin=3==MODE||4==MODE,classIds=['i','h','g','f','e','d','c','b','a'],charSet=[],uni=[9600,9610,9620,3900,9812,9120,9590,143345,48,143672,143682,143692,143702,820,8210,8680,9573,142080,142085,142990,143010,143030,9580,9540,1470,143762,143790,143810];function makeSet(e){let t=[];for(let r=e;r&lt;e+10;r++)t.push(String.fromCharCode(r));return t}let newSet,originalChars=[];for(let e of classIds){let t=document.querySelector('.'+e);if(t){let e=t.textContent;originalChars.push(e)}}if(charSet.push(originalChars),isOrigin)if(SEED&gt;9e3)for(let e of uni)charSet.push(makeSet(e));else charSet.push(makeSet(uni[Math.floor(SEED)%uni.length]));else if(SEED&gt;9970)for(let e of uni)charSet.push(makeSet(e));else SEED&gt;5e3&amp;&amp;charSet.push(makeSet(uni[Math.floor(SEED)%3]));charSet=charSet.flat();let mainSet=originalChars.reverse();SEED&gt;9950&amp;&amp;(mainSet=charSet);let gridEls=document.querySelectorAll('p'),grid=[],brushSize=2,pointerDown=!1,pointerShift=0,loopLength=100,airship=0;function draw(e){let t=classIds[pointerShift%classIds.length];e.activeClass=t,e.setAttribute('class',t),e.h=pointerShift%classIds.length}for(let e=0;e&lt;32;e++){grid.push([]);for(let t=0;t&lt;32;t++){let r=gridEls[t+32*e];grid[e][t]=r,r.originalClass=r.className,r.activeClass=r.originalClass,r.h=classIds.length-classIds.indexOf(r.originalClass)-1,r.originalH=r.h,isDaydream&amp;&amp;(r.style.webkitUserSelect='none',r.style.userSelect='none'),r.onpointermove=(i=&gt;{if(pointerDown&amp;&amp;isDaydream){for(let r=-brushSize;r&lt;brushSize;r++)for(let i=-brushSize;i&lt;brushSize;i++){let a=grid[Math.min(Math.max(0,e+r),31)][Math.min(Math.max(0,t+i),31)];draw(a)}}})}}let speedFac=SEED&gt;6500?30:1;setInterval(()=&gt;{for(let e=0;e&lt;32;e++)for(let t=0;t&lt;32;t++){let r=gridEls[t+32*e];0==MODE?r.h&gt;6-RESOURCE&amp;&amp;(r.textContent=mainSet[Math.floor(.25*airship+(r.h+.5*e+.1*DIRECTION*t))%mainSet.length]):(isDaydream||isTerraformed)&amp;&amp;(0==r.h?SEED&lt;8e3?r.textContent=mainSet[Math.floor(airship/1e3+.05*e+.005*t)%mainSet.length]:r.textContent=mainSet[Math.floor(airship/2+.05*e)%mainSet.length]:(r.textContent=charSet[Math.floor(airship/speedFac+e+r.h)%charSet.length],SEED&gt;5e3&amp;&amp;Math.random()&lt;.005&amp;&amp;(r.style.fontSize=`${3+airship%34}px`))),'j'!=r.originalClass&amp;&amp;'j'!=r.activeClass||(r.textContent=' ')}airship+=1},loopLength),document.addEventListener('keyup',e=&gt;{pointerDown=!1});";

function generateCSSColors(colors) {
	let gridClasses = "";
	for (let i = 0; i < 9; i++) {
		const color = colors[i];
		const className = classes[i];
		const css = `
            .${className} {
                background-color: ${color};
            }
        `;

		gridClasses += css;
	}

	const rClass = `
        .r {
            background-color: ${colors[9]};
        }
    `;

	return gridClasses + rClass;
}

function setForegroundAnimation(a, i, multiplier) {
	return `
        .${classes[i]} {
            animation:x ${a.duration + a.durationInc * multiplier}${a.easing} infinite;
        } `;
}

function setBackgroundAnimation(a) {
	return `
        .r {
            animation:z ${a.bgDuration}${a.easing} ${a.bgDelay}ms infinite;
        } `;
}

function setKeyframes(activation, colors, altColors) {
	let keyframes = "";

	if (activation === "Plague") {
		return "";
	} else {
		const initial = "@keyframes x {";

		for (let i = 0; i < 10; i++) {
			const color = colors[i];
			const className = classes[i];
			const keyframe = `
                ${i * 10}% {
                    color: ${color};
                }
            `;

			keyframes += keyframe;
		}

		const final = "}";

		return initial + keyframes + final;
	}
}

function generateAnimations(a, colors) {
	let animated = a.classesAnimated;
	let animatedClasses = "";
	let multiplier = 0;

	for (let i = 0; i < 9; i++) {
		// If the last digit == i, it is animated
		if (i == animated % 10) {
			const className = setForegroundAnimation(a, i, multiplier);
			multiplier += 1; // Increment the multiplier
			animated = animated / 10; // Move to next digit

			animatedClasses += className;
		}
	}

	if (a.activation === "Plague") {
		const className = setBackgroundAnimation(a);

		animatedClasses += className;
	}

	const keyframes = setKeyframes(a.activation, colors, a.altColors);

	return animatedClasses + keyframes;
}

function generateScript(p) {
	return `<script>let MODE=1;let RESOURCE=${p.resourceLvl}; let DIRECTION=${
		p.resourceDirection
	}; const SEED=${pseudoRandom(p.tile) % 10_000}${jsString}</script>`;
}

const opepenShape = [
	{
		rowIndex: 8,
		columns: [8, 9, 10, 11, 12, 13, 18, 19, 20, 21],
	},
	{
		rowIndex: 9,
		columns: [8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22],
	},
	{
		rowIndex: 10,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 11,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 12,
		columns: [12, 13, 14, 15, 20, 21, 22, 23],
	},
	{
		rowIndex: 13,
		columns: [12, 13, 14, 15, 20, 21, 22, 23],
	},
	{
		rowIndex: 14,
		columns: [12, 13, 14, 20, 21, 22],
	},
	{
		rowIndex: 15,
		columns: [12, 13, 20, 21],
	},
	{
		rowIndex: 16,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 17,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 18,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 19,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 20,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 21,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 22,
		columns: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
	},
	{
		rowIndex: 23,
		columns: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
	},
	{
		rowIndex: 28,
		columns: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
	},
	{
		rowIndex: 29,
		columns: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
	},
	{
		rowIndex: 30,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
	{
		rowIndex: 31,
		columns: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
	},
];

function getAllCells(shape, chars) {
	const cells = [];
	shape.forEach((item) => {
		item.columns.forEach((colIndex, index) => {
			let value = 0;
			let className = classes[value];
			let char = chars[value];

			cells.push({ rowIndex: item.rowIndex, colIndex, className, char });
		});
	});
	return cells;
}

export function makeSVG(p, a) {
	let boldString = "";
	if (p.charsIndex < 14 || (p.charsIndex > 33 && p.charsIndex < 37)) {
		boldString = "font-weight:bold;";
	}
	let grid = "";

	const opepenCells = USE_OPEPEN_SHAPE ? getAllCells(opepenShape, p.chars) : [];

	for (let row = 0; row < 32; row++) {
		for (let col = 0; col < 32; col++) {
			const isWithinOneColFromOpepen = opepenCells.some((cell) => {
				return (
					cell.colIndex === col &&
					(cell.rowIndex === row - 1 || cell.rowIndex === row + 1)
				);
			});
			const isWithinOneRowFromOpepen = opepenCells.some((cell) => {
				return (
					cell.rowIndex === row &&
					(cell.colIndex === col - 1 || cell.colIndex === col + 1)
				);
			});
			const isAdjacentCellFromOpepen =
				isWithinOneColFromOpepen || isWithinOneRowFromOpepen;

			const isWithinTwoColFromOpepen = opepenCells.some((cell) => {
				return (
					cell.colIndex === col &&
					(cell.rowIndex === row - 2 || cell.rowIndex === row + 2)
				);
			});
			const isWithinTwoRowFromOpepen = opepenCells.some((cell) => {
				return (
					cell.rowIndex === row &&
					(cell.colIndex === col - 2 || cell.colIndex === col + 2)
				);
			});

			const isAdjacentWithinTwoCellFromOpepen =
				isWithinTwoColFromOpepen || isWithinTwoRowFromOpepen;

			const cellMatch = opepenCells.find(
				(item) => item.rowIndex === row && item.colIndex === col,
			);

			if (cellMatch) {
				const char = cellMatch.char;
				const className = "a";

				grid += `<p class='${className}'>${p.chars[0]}</p>`;
			} else if (isAdjacentCellFromOpepen && ENABLE_PROXIMITY) {
				grid += `<p class='b'>${p.chars[1]}</p>`;
			} else if (isAdjacentWithinTwoCellFromOpepen && ENABLE_PROXIMITY) {
				grid += `<p class='c'>${p.chars[2]}</p>`;
			} else {
				const value = p.heightmapIndices[row][col];
				const char = value < 9 ? p.chars[value] : "&#160;";
				const className = classes[value];

				const node = `<p class='${className}'>${char}</p>`;

				grid += node;
			}
		}
	}

	const header = `
        <svg version='2.0' encoding='utf-8' viewBox='0 0 560 560' preserveAspectRatio='xMidYMid' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg'>
            <style>
                .meta {
                    width:560px;
                    height:560px;
                }
                .r {
                    box-sizing: border-box;
                    width:560px;
                    height:560px;
                    padding:24px;
                    font-size:${p.fontsize}px;
                    ${boldString}
                    display:grid;
                    grid-template-columns:repeat(32, 16px);
                    grid-template-rows: repeat(32, 16px);
                    grid-gap: 0px;
                    justify-content: space-between;
                }
                p {
                    font-family:monospace;
                    margin:0;
                    text-align: center;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    font-size: 14px;
                }
                ${generateCSSColors(p.zoneColors)}
            </style>
            <foreignObject x='0' y='0' width='560' height='560'>
                <div class='meta' xmlns='http://www.w3.org/1999/xhtml'>
                    <div class='r'>`;

	const animations = generateAnimations(a, p.zoneColors);
	const script = generateScript(p);

	const svg =
		header +
		grid +
		"</div></div></foreignObject><style>" +
		animations +
		"</style>" +
		script +
		"</svg>";

	return { svg, animations };
}
