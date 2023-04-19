import { bindAll } from '../../core/utils';

export default class Template {
	charCodes = {
		A: 65,
		Z: 90,
	};

	colsCount = this.charCodes.Z - this.charCodes.A;

	rowCached;

	constructor(rowsCount = 10) {
		this.rowsCount = rowsCount;
		bindAll(this);
		this.html = this.createTable();
	}

	getColumn(_, index) {
		return `<li class="document-table__column" data-resizable>${String.fromCharCode(
			this.charCodes.A + index,
		)}
	<div class="document-table__resizer document-table__resizer_column" data-resizer="col"></div></li>`;
	}

	getHeader() {
		let header =
			'<ul class="document-table__header" data-table="header" data-table-role="headers-list">';
		header += new Array(this.colsCount).fill('').map(this.getColumn).join('');
		return `${header}</ul>`;
	}

	getInfo(_, index) {
		return `<li class="document-table__info-row"  data-resizable>${index + 1}
	<div class="document-table__resizer document-table__resizer_row" data-resizer="row"></div></li>`;
	}

	getInfoColumn() {
		let info =
			'<ul class="document-table__info-column" data-table="info" data-table-role="indexes-list">';
		info += new Array(this.rowsCount).fill('').map(this.getInfo).join('');
		return `${info}</ul>`;
	}

	getCell() {
		return `<li class="document-table__cell" contenteditable="true"></li>`;
	}

	getCells() {
		let cells = '<ul class="document-table__row-cells" data-table-role="cells-list">';
		cells += new Array(this.colsCount).fill('').map(this.getCell).join('');
		return `${cells}</ul>`;
	}

	getRow() {
		if (!this.rowCached) {
			let row = '<li class="document-table__row">';
			row += `${this.getCells()}</li>`;
			this.rowCached = row;
		}
		return this.rowCached;
	}

	getRows() {
		let rows = '<ul class="document-table__rows" data-table="rows" data-table-role="rows-list">';
		rows += new Array(this.rowsCount).fill('').map(this.getRow).join('');
		return `${rows}</ul>`;
	}

	getBody() {
		let body = '<div class="document-table__body" data-table="body">';
		body += this.getInfoColumn(this.rowsCount);
		body += this.getRows(this.rowsCount);
		return `${body}</div>`;
	}

	createTable() {
		let tableHTML = `<div class="document-table__info-row document-table__info-row_empty"></div>`;
		tableHTML += this.getHeader();
		tableHTML += this.getBody(this.rowsCount);
		return tableHTML;
	}
}
