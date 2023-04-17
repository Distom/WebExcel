import ExcelComponent from '../../core/ExcelComponent';
import $ from '../../core/dom';
import createTableHTML from './table.template';

export default class Table extends ExcelComponent {
	static className = 'main-document__table document-table';

	static tagName = 'section';

	constructor(root) {
		super(root, {
			name: 'Table',
		});
		this.updateTableColumnsScroll = this.updateTableColumnsScroll.bind(this);
		this.updateTableRowsHeight = this.updateTableRowsHeight.bind(this);
	}

	init() {
		super.init();

		this.header = $('.document-table__header');
		this.rows = $('.document-table__rows');
		this.body = $('.document-table__body');

		this.body.on('scroll', this.updateTableRowsHeight);
		this.rows.on('scroll', this.updateTableColumnsScroll);
		window.addEventListener('resize', this.updateTableRowsHeight);
	}

	toHTML() {
		return createTableHTML(1000);
	}

	updateTableRowsHeight() {
		requestAnimationFrame(() => {
			const tableRowsHeight = this.root.cHeight - this.header.cHeight;
			this.rows.style.height = `${tableRowsHeight + this.body.scrollY}px`;
		});
	}

	updateTableColumnsScroll() {
		requestAnimationFrame(() => {
			this.header.style.transform = `translateX(-${this.rows.scrollX}px)`;
		});
	}
}
