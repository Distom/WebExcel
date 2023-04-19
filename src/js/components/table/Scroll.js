import { bindAll, updateCssPropertyScrollBarWidth } from '../../core/utils';

export default class Scroll {
	constructor(table) {
		this.table = table;
		bindAll(this);
		this.init();
	}

	init() {
		this.table.body.on('scroll', this.updateTableRowsHeight);
		this.table.rows.on('scroll', this.updateTableColumnsScroll);
		window.addEventListener('resize', this.updateTableRowsHeight);

		updateCssPropertyScrollBarWidth();
		window.addEventListener('resize', updateCssPropertyScrollBarWidth);
	}

	updateTableRowsHeight() {
		requestAnimationFrame(() => {
			const tableRowsHeight = this.table.root.cHeight - this.table.header.cHeight;
			this.table.rows.css({ height: `${tableRowsHeight + this.table.body.scrollY}px` });
		});
	}

	updateTableColumnsScroll() {
		requestAnimationFrame(() => {
			this.table.header.css({ marginLeft: `-${this.table.rows.scrollX}px` });
		});
	}
}
