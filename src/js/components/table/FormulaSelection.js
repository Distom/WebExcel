import $ from '../../core/dom';
import { getScrollBarWidth, parseStyles } from '../../core/utils';
import { setStyles, textInput } from '../../store/actions';

let scrollBarWidth = getScrollBarWidth();

export default class FormulaSelection {
	selectionActive = false;

	formulaSelected = [[]];

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
		[this.endCol, this.endRow] = this.table.selection.selected.at(-1).at(-1).data.cellId.split(':');
		[this.startCol, this.startRow] = this.table.selection.selected[0][0].data.cellId.split(':');

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
			this.setFormulaSelected();
		}

		this.table.scrollRows(event, scrollBarWidth);
	}

	onPointerup() {
		if (!this.selectionActive) return;
		this.selectionActive = false;
		this.lastSelected = null;

		this.removeFormulaRect();
		this.updateFormulaSelectedValues();
		this.updateSelection();
		this.addSelectionRect();
	}

	updateSelection() {
		let lastSelected = this.table.selection.selected.at(-1).at(-1);
		let firstSelected = this.table.selection.selected[0][0];

		switch (this.formulaRectDirection) {
			case 'right':
			case 'bottom':
				lastSelected = this.formulaSelected.at(-1).at(-1);
				break;
			case 'top':
			case 'left':
				firstSelected = this.formulaSelected[0][0];
				break;
			// no default
		}

		this.table.selection.selectGroup(lastSelected, firstSelected);
	}

	updateFormulaSelectedValues() {
		const selected = this.table.selection.selected;

		const cloneCell = (referents, cell) => {
			const id = cell.data.cellId;
			const content = referents.data.content;

			cell.html(referents.html());
			cell.data.content = content;
			this.table.dispatch(textInput(id, content));

			const cellWidth = cell.style.width;
			// width = '', to get styles without width for dispatch
			cell.css(referents.css()).css({ width: '' });
			this.table.dispatch(setStyles(id, parseStyles(cell.css())));
			cell.css({ width: cellWidth });
		};

		switch (this.formulaRectDirection) {
			case 'top': {
				let formulaI = this.formulaSelected.length - 1;

				while (formulaI >= 0) {
					for (let i = selected.length - 1; i >= 0; i -= 1) {
						if (formulaI < 0) return;

						for (let j = selected[i].length - 1; j >= 0; j -= 1) {
							const formulaCell = this.formulaSelected[formulaI][j];
							const selectedCell = selected[i][j];
							cloneCell(selectedCell, formulaCell);
						}

						formulaI -= 1;
					}
				}

				break;
			}

			case 'left': {
				const formulaColsCount = this.formulaSelected[0].length;
				const selectedColsCount = selected[0].length;

				let formulaI = formulaColsCount - 1;

				while (formulaI >= 0) {
					for (let i = selectedColsCount - 1; i >= 0; i -= 1) {
						if (formulaI < 0) return;

						for (let j = selected.length - 1; j >= 0; j -= 1) {
							const formulaCell = this.formulaSelected[j][formulaI];
							const selectedCell = selected[j][i];
							cloneCell(selectedCell, formulaCell);
						}

						formulaI -= 1;
					}
				}

				break;
			}

			case 'right': {
				const formulaColsCount = this.formulaSelected[0].length;
				const selectedColsCount = selected[0].length;

				let selectedI = 0;

				for (let i = 0; i < formulaColsCount; i += 1) {
					selectedI = i % selectedColsCount;

					for (let j = 0; j < this.formulaSelected.length; j += 1) {
						const formulaCell = this.formulaSelected[j][i];
						const selectedCell = selected[j][selectedI];
						cloneCell(selectedCell, formulaCell);
					}
				}

				break;
			}

			case 'bottom': {
				let selectedI = 0;

				for (let i = 0; i < this.formulaSelected.length; i += 1) {
					selectedI = i % selected.length;

					for (let j = 0; j < this.formulaSelected[i].length; j += 1) {
						const formulaCell = this.formulaSelected[i][j];
						const selectedCell = selected[selectedI][j];
						cloneCell(selectedCell, formulaCell);
					}
				}

				break;
			}

			// no default
		}
	}

	setFormulaSelected() {
		let startRow = this.startRow;
		let startCol = this.startCol;
		let endRow = this.endRow;
		let endCol = this.endCol;

		switch (this.formulaRectDirection) {
			case 'none': {
				this.formulaSelected = [[]];
				return;
			}

			case 'top': {
				startRow = this.lastSelected.data.cellId.split(':')[1];
				endRow = +this.startRow - 1;
				break;
			}

			case 'left': {
				startCol = this.lastSelected.data.cellId.split(':')[0];
				endCol = +this.startCol - 1;
				break;
			}

			case 'right': {
				startCol = +this.endCol + 1;
				endCol = this.lastSelected.data.cellId.split(':')[0];
				break;
			}

			case 'bottom': {
				startRow = +this.endRow + 1;
				endRow = this.lastSelected.data.cellId.split(':')[1];
				break;
			}

			// no default
		}

		const startCell = this.table.getCell(+startCol, +startRow);
		const endCell = this.table.getCell(+endCol, +endRow);

		this.formulaSelected = this.table.getCells(startCell, endCell);
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
					this.formulaRectDirection = 'none';
					break;

				case topDiff:
					this.formulaRectDirection = 'top';
					top =
						$(this.table.rowsList.children[row]).top -
						this.table.header.bottom +
						this.table.body.scrollY;
					left = this.rectLeft;
					width = this.rectWidth;
					height = this.rectTop - top;
					break;

				case rightDiff:
					this.formulaRectDirection = 'right';
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
					this.formulaRectDirection = 'bottom';
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
					this.formulaRectDirection = 'left';
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

		let startCell = this.table.selection.selected[0][0];
		let endCell = this.table.selection.selected.at(-1).at(-1);

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
