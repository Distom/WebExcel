import $ from '../../core/dom';

export default class FormulaSelection {
	selectionActive = false;

	constructor(table) {
		this.table = table;
	}

	onPointerdown(event) {
		if (event.target !== this.selectionCircle.elem) return;

		this.selectionActive = true;
		[this.startCol, this.startRow] =
			this.table.selection.selected[this.table.selection.selected.length - 1].data.cellId.split(
				':',
			);

		console.log(this.startCol, this.startRow);
	}

	onPointermove(event) {
		// eslint-disable-next-line no-useless-return
		if (!this.selectionActive) return;
	}

	onPointerup() {}

	add;

	addSelectionRect(elem) {
		this.removeSelectionRect();

		this.selectionRect = $.create('div', 'selection-rect');
		this.selectionCircle = $.create('div', 'selection-rect__circle');

		let startCell = this.table.selection.selected[0];
		let endCell = this.table.selection.selected[this.table.selection.selected.length - 1];

		if (elem) {
			startCell = elem;
			endCell = elem;
		}

		const top = startCell.top - this.table.header.bottom + this.table.body.scrollY;
		const left = startCell.left - this.table.rows.left + this.table.rows.scrollX;
		const height = endCell.bottom - this.table.header.bottom + this.table.body.scrollY - top;
		const width = endCell.right - this.table.rows.left + this.table.rows.scrollX - left;

		this.selectionRect.css({
			top: `${top - 1}px`,
			left: `${left - 1}px`,
			height: `${height + 1}px`,
			width: `${width + 1}px`,
		});

		this.selectionRect.append(this.selectionCircle);
		this.table.rows.append(this.selectionRect);
	}

	removeSelectionRect() {
		if (!this.selectionRect) return;
		this.selectionRect.remove();
	}
}
