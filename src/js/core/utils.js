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
		if (key === 'constructor') return;
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

function getFormatChord(cell) {
	const CODE_A = 65;
	const [col, row] = cell.data.cellId.split(':');
	return `${String.fromCharCode(CODE_A + +col)}${+row + 1}`;
}

function isEqualObjects(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}

function localStore(key, value = null) {
	if (!value) {
		return JSON.parse(localStorage.getItem(key));
	}

	localStorage.setItem(key, JSON.stringify(value));
	return true;
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
	getFormatChord,
	isEqualObjects,
	localStore,
};
