import $ from '../../core/dom';
import { cellChords, getScrollBarWidth, getRange, getCharKeyCodes } from '../../core/utils';
import { textInput } from '../../store/actions';

let scrollBarWidth = getScrollBarWidth();

export default class Selection {
	static activeClass = 'active';

	static selectedClass = 'selected';

	static navigationKeys = [
		'ArrowUp',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'Tab',
		'Enter',
		'Delete',
		'Escape',
		'Backspace',
		...getCharKeyCodes(),
	];

	#active;

	#lastSelected;

	selectionActive = false;

	selected = [];

	constructor(table) {
		this.table = table;

		this.selectionObserver = new MutationObserver(this.observeSelection.bind(this));
		this.selectionObserver.observe(table.root.elem, {
			subtree: true,
			attributes: true,
			attributeFilter: ['class'],
		});

		this.active = this.table.root.select('[data-cell-id="0:0"]');
	}

	set active(cell) {
		if (cell.elem === this.#active?.elem) return;

		if (this.#active) {
			this.#active.delClass(Selection.activeClass);
		}

		this.table.emit('cell:changed', cell);
		this.table.emit('table:select', { start: cell });

		this.table.root.focus();
		this.clearSelected();
		this.selected.push(cell);
		this.lastSelected = cell;
		this.#active = cell.addClass(Selection.activeClass);
	}

	get active() {
		return this.#active;
	}

	set lastSelected(cell) {
		this.#lastSelected = cell;
		if (!cell) return;

		this.table.emit('table:select', { end: cell });
	}

	get lastSelected() {
		return this.#lastSelected;
	}

	get cellFocused() {
		return !!document.activeElement.closest('[data-table="cell"]');
	}

	onPointerdown(event) {
		const cell = $(event.target).closest('[data-table="cell"]');

		if (!cell) {
			this.table.root.focus();
			return;
		}

		if (this.cellFocused && this.active.elem === cell.elem) return;

		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);

		if (event.shiftKey) {
			this.selectGroup(cell);
		} else {
			this.active = cell;
		}

		scrollBarWidth = getScrollBarWidth();

		this.selectionActive = true;
	}

	onPointermove(event) {
		if (!this.selectionActive) return;

		const hoveredElem = document.elementFromPoint(event.pageX, event.pageY);
		if (!hoveredElem) return;

		const lastSelected = $(hoveredElem).closest('[data-table="cell"]');
		this.selectGroup(lastSelected);

		this.scrollRows(event);
	}

	onPointerup() {
		this.selectionActive = false;
	}

	onDblclick() {
		this.focusActiveCell();
	}

	focusActiveCell() {
		const textNode = this.active.fChild;

		if (textNode) {
			const range = document.createRange();
			const sel = window.getSelection();

			range.setStart(textNode, this.active.text().length);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);
		} else {
			this.active.focus();
		}
	}

	onKeydown(event) {
		if (!Selection.navigationKeys.includes(event.code)) return;

		let { col, row } = cellChords(this.active);

		if (this.cellFocused) {
			switch (event.code) {
				case 'Enter':
					/* if (event.ctrlKey) {
						// const sel = window.getSelection();
						// const cursor = sel.extentOffset;
						// const text = this.active.text();
						// this.active.text(`${text.slice(0, cursor)}<br>${text.slice(cursor)}`);
						// const range = document.createRange();
						// range.setStart(this.active.fChild, cursor);
						// range.collapse(true);
						// sel.removeAllRanges();
						// sel.addRange(range);


						// const enterEvent = new KeyboardEvent('keydown', {
						// 	code: 'Enter',
						// 	bubbles: true,
						// });
						// this.active.elem.dispatchEvent(enterEvent);
						// console.log(enterEvent);
						return;
					} */
					event.preventDefault();
					if (event.shiftKey) {
						row -= 1;
					} else {
						row += 1;
					}
					break;

				case 'Escape':
					event.preventDefault();
					this.table.root.focus();
					return;

				// no default
			}
		} else {
			if (getCharKeyCodes().includes(event.code)) {
				this.active.text('');
				this.focusActiveCell();
				this.clearSelected();
				this.selected.push(this.active);
				this.lastSelected = this.active;

				return;
			}

			switch (event.code) {
				case 'ArrowUp':
					event.preventDefault();
					row -= 1;
					break;

				case 'ArrowDown':
					event.preventDefault();
					row += 1;
					break;

				case 'ArrowLeft':
					event.preventDefault();
					col -= 1;
					break;

				case 'ArrowRight':
					event.preventDefault();
					col += 1;
					break;

				case 'Enter':
					event.preventDefault();
					this.focusActiveCell();
					return;

				case 'Delete':
				case 'Backspace':
					event.preventDefault();

					this.selected.forEach(cell => {
						cell.text('');
						this.table.dispatch(textInput(cell.data.cellId, ''));
					});

					this.table.emit('cell:input', '');
					return;

				// no default
			}
		}

		switch (event.code) {
			case 'Tab':
				event.preventDefault();

				if (event.shiftKey) {
					col -= 1;
				} else {
					col += 1;
				}

				break;

			// no default
		}

		col = Math.max(0, col);
		col = Math.min(this.table.template.colsCount - 1, col);
		row = Math.max(0, row);
		row = Math.min(this.table.template.rowsCount - 1, row);

		const nextCell = this.table.root.select(`[data-cell-id="${col}:${row}"]`);

		this.scrollToCell(nextCell);

		this.active = nextCell;
	}

	scrollRows(event) {
		const scrollStep = 5;

		const scrollBarLeft = this.table.root.oWidth - scrollBarWidth;
		const scrollBarTop = this.table.root.oHeight + this.table.root.top - scrollBarWidth;
		const scrollBarRight = this.table.info.oWidth;
		const scrollBarBottom = this.table.root.top + this.table.header.oHeight;

		if (event.pageX >= scrollBarLeft) {
			this.table.rows.scrollBy({ left: scrollStep });
		} else if (event.pageX <= scrollBarRight) {
			this.table.rows.scrollBy({ left: -scrollStep });
		}

		if (event.pageY >= scrollBarTop) {
			this.table.body.scrollBy({ top: scrollStep });
		} else if (event.pageY <= scrollBarBottom) {
			this.table.body.scrollBy({ top: -scrollStep });
		}
	}

	scrollToCell(cell) {
		const cellLeft = cell.left - this.table.info.oWidth + this.table.rows.scrollX;
		const cellRight = cellLeft + cell.oWidth;
		const cellTop = cell.top - this.table.body.top + this.table.body.scrollY;
		const cellBottom = cellTop + cell.oHeight;

		scrollBarWidth = getScrollBarWidth();

		const tableVisibleHeight = this.table.root.oHeight - this.table.header.oHeight - scrollBarWidth;
		const tableVisibleWidth = this.table.root.oWidth - this.table.info.oWidth - scrollBarWidth;

		if (this.table.body.scrollY > cellTop) {
			this.table.body.scrollTo({ top: cellTop });
		} else if (this.table.body.scrollY + tableVisibleHeight < cellBottom) {
			this.table.body.scrollTo({ top: cellBottom - tableVisibleHeight });
		}

		if (this.table.rows.scrollX > cellLeft) {
			this.table.rows.scrollTo({ left: cellLeft });
		} else if (this.table.rows.scrollX + tableVisibleWidth < cellRight) {
			this.table.rows.scrollTo({ left: cellRight - tableVisibleWidth });
		}
	}

	selectGroup(lastSelected) {
		if (!lastSelected) return;
		if (this.lastSelected?.elem === lastSelected.elem) return;

		this.clearSelected();
		this.lastSelected = lastSelected;

		const colsIds = getRange(cellChords(this.active).col, cellChords(lastSelected).col);
		const rowsIds = getRange(cellChords(this.active).row, cellChords(lastSelected).row);

		rowsIds.forEach(rowId => {
			colsIds.forEach(colId => {
				const row = $(this.table.rowsList.children[rowId]);
				const cellsList = row.select('[data-table-role="cells-list"]');
				const cell = $(cellsList.children[colId]);

				this.selected.push(cell);

				cell.addClass(Selection.selectedClass);
			});
		});

		if (this.selected.length === 1) this.active.delClass(Selection.selectedClass);
	}

	clearSelected() {
		this.selected.forEach(cell => cell.delClass(Selection.selectedClass));
		this.selected = [];
		this.lastSelected = null;
	}

	observeSelection(mutations) {
		mutations.forEach(mutation => {
			const cell = $(mutation.target).closest('[data-table="cell"]');
			if (!cell) return;

			const { col, row } = cellChords(cell);
			const header = $(this.table.headersList.children[col]);
			const info = $(this.table.indexesList.children[row]);

			if (cell.hasClass(Selection.selectedClass) || cell.hasClass(Selection.activeClass)) {
				header.addClass(Selection.selectedClass);
				info.addClass(Selection.selectedClass);
			} else if (!cell.hasClass(Selection.selectedClass) && !cell.hasClass(Selection.activeClass)) {
				header.delClass(Selection.selectedClass);
				info.delClass(Selection.selectedClass);
			}
		});
	}
}
