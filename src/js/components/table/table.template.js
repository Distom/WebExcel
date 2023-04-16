const CHAR_CODES = {
	A: 65,
	Z: 90,
};

const COLUMNS_COUNT = CHAR_CODES.Z - CHAR_CODES.A;

function getCell() {
	return '<li class="document-table__cell" contenteditable="true"></li>';
}

function getColumn(_, index) {
	return `<li class="document-table__column">${String.fromCharCode(CHAR_CODES.A + index)}</li>`;
}

function getRowInfo(index) {
	return `<div class="document-table__row-info">${index || ''}</div>`;
}

function getCells() {
	let columns = '<ul class="document-table__row-cells">';
	columns += new Array(COLUMNS_COUNT).fill('').map(getCell).join('');
	return `${columns}</ul>`;
}

function getRow(_, index) {
	let row = '<li class="document-table__row">';
	row += getRowInfo(index + 1);
	row += getCells();
	return `${row}</li>`;
}

function getHeaderColumns() {
	let columns = '<ul class="document-table__row-columns">';
	columns += new Array(COLUMNS_COUNT).fill('').map(getColumn).join('');
	return `${columns}</ul>`;
}

function getHeaderRow() {
	let row = '<li class="document-table__row">';
	row += getRowInfo();
	row += getHeaderColumns();
	return `${row}</li>`;
}

export default function createTableHTML(rowsCount) {
	let tableHTML = '<ul class="document-table__rows">';
	tableHTML += getHeaderRow();
	tableHTML += new Array(rowsCount).fill('').map(getRow).join('');
	return `${tableHTML}</ul>`;
}
