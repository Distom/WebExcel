import { bindAll, getInlineStyles } from '../../core/utils';

export default class Template {
	charCodes = {
		A: 65,
		Z: 90,
	};

	colsCount = this.charCodes.Z - this.charCodes.A + 1;

	constructor(table, rowsCount = 10) {
		this.table = table;
		this.state = table.store.getState();
		this.rowsCount = rowsCount;
		bindAll(this);
		this.html = this.createTable();
	}

	getColumn(_, index) {
		const width = this.state.colsState[index];
		const widthStyle = width ? `width: ${width}px;` : '';
		return `<li class="document-table__column" data-resizable style="${widthStyle}">${this.getColLetter(
			index,
		)}
			<div class="document-table__resizer document-table__resizer_column" data-resizer="col"></div>
		</li>`;
	}

	getHeader() {
		let header =
			'<ul class="document-table__header" data-table="header" data-table-role="headers-list">';
		header += new Array(this.colsCount).fill('').map(this.getColumn).join('');
		return `${header}</ul>`;
	}

	getInfo(_, index) {
		const height = this.state.rowsState[index];
		const heightStyle = height ? `height: ${height}px;` : '';
		return `<li class="document-table__info-row"  data-resizable style="${heightStyle}">${index + 1}
			<div class="document-table__resizer document-table__resizer_row" data-resizer="row"></div>
		</li>`;
	}

	getInfoColumn() {
		let info =
			'<ul class="document-table__info-column" data-table="info" data-table-role="indexes-list">';
		info += new Array(this.rowsCount).fill('').map(this.getInfo).join('');
		return `${info}</ul>`;
	}

	getCell(colIndex, rowIndex) {
		const id = `${colIndex}:${rowIndex}`;
		const text = this.state.cellsState[id]?.data || '';

		let styles = this.state.cellsState[id]?.styles;
		styles = styles ? getInlineStyles(styles) : '';

		const width = this.state.colsState[colIndex];
		const widthStyle = width ? `width: ${width}px;` : '';

		return `<li class="document-table__cell" contenteditable="true" data-table="cell" data-cell-id="${id}" style="${widthStyle} ${styles}">${text}</li>`;
	}

	getCells(rowIndex) {
		let cells = '<ul class="document-table__row-cells" data-table-role="cells-list">';

		cells += new Array(this.colsCount)
			.fill('')
			.map((_, colIndex) => this.getCell(colIndex, rowIndex))
			.join('');

		return `${cells}</ul>`;
	}

	getRow(index) {
		const height = this.state.rowsState[index];
		const heightStyle = height ? `height: ${height}px;` : '';
		return `<li class="document-table__row" style="${heightStyle}">${this.getCells(index)}</li>`;
	}

	getRows() {
		let rows = '<ul class="document-table__rows" data-table="rows" data-table-role="rows-list">';

		rows += new Array(this.rowsCount)
			.fill('')
			.map((_, index) => this.getRow(index))
			.join('');

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

	getColLetter(index) {
		return String.fromCharCode(this.charCodes.A + index);
	}
}
