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

	const letterKeyCodes = new Array(26)
		.fill('')
		.map((_, index) => `Key${String.fromCharCode(CODE_A + index)}`);

	return letterKeyCodes;
}

function getFormatChord(cell) {
	const CODE_A = 65;
	const [col, row] = cell.data.cellId.split(':');
	return `${String.fromCharCode(CODE_A + +col)}${+row + 1}`;
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
	getFormatChord,
};
