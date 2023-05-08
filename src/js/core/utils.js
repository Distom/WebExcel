import $ from './dom';

function capitalize(string) {
	return string[0].toUpperCase() + string.slice(1);
}

function getScrollBarWidth() {
	const div = $.create('div').css({
		height: '200px',
		width: '100px',
		position: 'fixed',
		top: 0,
		left: '-150px',
		overflow: 'scroll',
	});
	document.body.append(div.elem);
	const scrollBarWidth = div.oWidth - div.cWidth;
	div.remove();
	return scrollBarWidth;
}

function updateCssProperty(property, value) {
	document.documentElement.style.setProperty(property, value);
}

function updateCssPropertyScrollBarWidth() {
	updateCssProperty('--scrollbar-width', `${getScrollBarWidth()}px`);
}

function bindAll(obj) {
	const prototype = Object.getPrototypeOf(obj);
	Object.getOwnPropertyNames(prototype).forEach(key => {
		if (key === 'constructor' || typeof obj[key] !== 'function') return;
		obj[key] = obj[key].bind(obj);
	});
}

function cellChords(cell) {
	const [col, row] = cell.data.cellId.split(':');
	return {
		col: +col,
		row: +row,
	};
}

function getRange(a, b) {
	const [min, max] = a > b ? [b, a] : [a, b];
	return new Array(max - min + 1).fill('').map((_, index) => min + index);
}

function getLetterKeyCodes() {
	const CODE_A = 65;

	return new Array(26).fill('').map((_, index) => `Key${String.fromCharCode(CODE_A + index)}`);
}

function getDigitKeyCodes() {
	return new Array(10).fill('').map((_, index) => `Digit${index}`);
}

function getSymbolKeyCodes() {
	return [
		'Backquote',
		'Minus',
		'Equal',
		'Backslash',
		'BracketLeft',
		'BracketRight',
		'Semicolon',
		'Quote',
		'Slash',
		'Period',
		'Comma',
		'NumpadDivide',
		'NumpadMultiply',
		'NumpadSubtract',
		'NumpadAdd',
	];
}

function getCharKeyCodes() {
	return [...getLetterKeyCodes(), ...getDigitKeyCodes(), ...getSymbolKeyCodes()];
}

function getLetterChord(cell) {
	const CODE_A = 65;
	const [col, row] = cell.data.cellId.split(':');
	return `${String.fromCharCode(CODE_A + +col)}${+row + 1}`;
}

function converToNumberChord(chord) {
	const CODE_A = 65;

	const colLetter = chord.slice(0, 1);
	const rowNumber = +chord.slice(1) - 1;

	if (!/[A-Z]/.test(colLetter)) return false;

	const colNumber = colLetter.charCodeAt() - CODE_A;

	return `${colNumber}:${rowNumber}`;
}

function isEqualObjects(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}

function localStorageObj(key, value = null) {
	if (!value) {
		return JSON.parse(localStorage.getItem(key));
	}

	localStorage.setItem(key, JSON.stringify(value));
	return true;
}

function cammelToKebab(str) {
	return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

function kebabToCammel(str) {
	return str.replace(/-\w/g, match => `${match.slice(1).toUpperCase()}`);
}

function getInlineStyles(styles) {
	return Object.keys(styles)
		.map(key => `${cammelToKebab(key)}: ${styles[key]};`)
		.join(' ');
}

function getLastTextNode(elem) {
	const domElem = $(elem);
	let textNode;

	for (let i = domElem.childs.length - 1; i >= 0; i -= 1) {
		textNode = domElem.childs[i];

		if (textNode instanceof Text) {
			return textNode;
		}

		const subElem = $(domElem.childs[i]);

		for (let j = subElem.childs.length - 1; j >= 0; j -= 1) {
			textNode = subElem.childs[j];
			if (textNode instanceof Text) return textNode;
		}
	}

	return null;
}

function defuseHTML(str, allowedTags = []) {
	return str.replace(/<.+?>/g, match => {
		const tagName = match.replace(/<|>|\//g, '').split(' ')[0];
		return allowedTags.includes(tagName) ? match : `&lt;${match.slice(1, -1)}&gt;`;
	});
}

function parseStyles(stylesStr) {
	const styles = {};

	stylesStr.split(';').forEach(style => {
		const [prop, value] = style.split(':');
		if (!prop) return;

		styles[kebabToCammel(prop.trim())] = value.trim();
	});

	return styles;
}

function cloneObj(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function formatDate(number) {
	return number < 10 ? `0${number}` : number;
}

export {
	capitalize,
	getScrollBarWidth,
	updateCssProperty,
	updateCssPropertyScrollBarWidth,
	bindAll,
	cellChords,
	getRange,
	getLetterKeyCodes,
	getDigitKeyCodes,
	getSymbolKeyCodes,
	getCharKeyCodes,
	getLetterChord,
	isEqualObjects,
	localStorageObj,
	getInlineStyles,
	cammelToKebab,
	getLastTextNode,
	defuseHTML,
	parseStyles,
	kebabToCammel,
	converToNumberChord,
	cloneObj,
	formatDate,
};
