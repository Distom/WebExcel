import $ from '../../core/dom';
import { getScrollBarWidth } from '../../core/utils';

let scrollBarWidth = getScrollBarWidth();

export default class FormulaSelection {
	selectionActive = false;

	constructor(table) {
		this.table = table;
	}

	onPointerdown(event) {
		if (event.target !== this.selectionCircle.elem) return;

		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);

		// update scrollbar width for scroll
		scrollBarWidth = getScrollBarWidth();

		this.selectionActive = true;
		[this.endCol, this.endRow] =
			this.table.selection.selected[this.table.selection.selected.length - 1].data.cellId.split(
				':',
			);
		[this.startCol, this.startRow] = this.table.selection.selected[0].data.cellId.split(':');

		this.addFormulaRect();
	}

	onPointermove(event) {
		if (!this.selectionActive) return;

		const hoveredElem = document.elementFromPoint(event.pageX, event.pageY);
		if (!hoveredElem) return;

		const lastSelected = $(hoveredElem).closest('[data-table="cell"]');
		if (lastSelected && lastSelected.elem !== this.lastSelected?.elem) {
			this.lastSelected = lastSelected;
			this.addFormulaRect();
		}

		this.table.scrollRows(event, scrollBarWidth);
	}

	onPointerup() {
		this.selectionActive = false;
		this.lastSelected = null;
		this.removeFormulaRect();
	}

	addFormulaRect() {
		this.removeFormulaRect();

		this.formulaRect = $.create('div', 'formula-rect');

		if (this.lastSelected) {
			let top = 0;
			let left = 0;
			let width = 0;
			let height = 0;

			const [col, row] = this.lastSelected.data.cellId.split(':');

			const topDiff = this.startRow - row;
			const bottomDiff = row - this.endRow;
			const leftDiff = this.startCol - col;
			const rightDiff = col - this.endCol;

			const maxDiff = Math.max(topDiff, rightDiff, bottomDiff, leftDiff, 0);

			switch (maxDiff) {
				case 0:
					break;

				case topDiff:
					top =
						$(this.table.rowsList.children[row]).top -
						this.table.header.bottom +
						this.table.body.scrollY;
					left = this.rectLeft;
					width = this.rectWidth;
					height = this.rectTop - top;
					break;

				case rightDiff:
					top = this.rectTop;
					left = this.rectLeft + this.rectWidth;
					width =
						$(this.table.headersList.children[col]).right -
						this.table.rows.left +
						this.table.rows.scrollX -
						left;
					height = this.rectHeight;
					break;

				case bottomDiff:
					top = this.rectTop + this.rectHeight;
					left = this.rectLeft;
					width = this.rectWidth;
					height =
						$(this.table.rowsList.children[row]).bottom -
						this.table.header.bottom +
						this.table.body.scrollY -
						top;
					break;

				case leftDiff:
					top = this.rectTop;
					left =
						$(this.table.headersList.children[col]).left -
						this.table.rows.left +
						this.table.rows.scrollX;
					width = this.rectLeft - left;
					height = this.rectHeight;
					break;

				// no default
			}

			this.formulaRect.css({
				top: `${top - 1}px`,
				left: `${left - 1}px`,
				width: `${width + 1}px`,
				height: `${height + 1}px`,
			});
		}

		this.table.rows.append(this.formulaRect);
	}

	removeFormulaRect() {
		if (!this.formulaRect) return;
		this.formulaRect.remove();
	}

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

		this.rectTop = top;
		this.rectLeft = left;
		this.rectWidth = width;
		this.rectHeight = height;

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
