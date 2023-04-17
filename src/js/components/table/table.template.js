const CHAR_CODES = {
	A: 65,
	Z: 90,
};

const COLUMNS_COUNT = CHAR_CODES.Z - CHAR_CODES.A;
let rowCached;

function getColumn(_, index) {
	return `<li class="document-table__column">${String.fromCharCode(CHAR_CODES.A + index)}</li>`;
}

function getHeader() {
	let header = '<ul class="document-table__header">';
	header += new Array(COLUMNS_COUNT).fill('').map(getColumn).join('');
	return `${header}</ul>`;
}

function getInfo(_, index) {
	return `<li class="document-table__info-row">${index + 1}</li>`;
}

function getInfoColumn(rowsCount) {
	let info = '<ul class="document-table__info-column">';
	info += new Array(rowsCount).fill('').map(getInfo).join('');
	return `${info}</ul>`;
}

function getCell() {
	return '<li class="document-table__cell" contenteditable="true"></li>';
}

function getCells() {
	let cells = '<ul class="document-table__row-cells">';
	cells += new Array(COLUMNS_COUNT).fill('').map(getCell).join('');
	return `${cells}</ul>`;
}

function getRow() {
	if (!rowCached) {
		let row = '<li class="document-table__row">';
		row += getCells();
		row += `${row}</li>`;
		rowCached = row;
	}
	return rowCached;
}

function getRows(rowsCount) {
	let rows = '<ul class="document-table__rows">';
	rows += new Array(rowsCount).fill('').map(getRow).join('');
	return `${rows}</ul>`;
}

function getBody(rowsCount) {
	let body = '<div class="document-table__body">';
	body += getInfoColumn(rowsCount);
	body += getRows(rowsCount);
	return `${body}</div>`;
}

export default function createTableHTML(rowsCount) {
	let tableHTML = `<div class="document-table__info-row document-table__info-row_empty"></div>`;
	tableHTML += getHeader();
	tableHTML += getBody(rowsCount);
	return tableHTML;
}
