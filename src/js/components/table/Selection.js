import $ from '../../core/dom';
import { cellChords, range } from '../../core/utils';

export default class Selection {
	static activeClass = 'active';

	static selectedClass = 'selected';

	static instance;

	static navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];

	#active;

	selectionActive = false;

	selected = [];

	lastSelected;

	constructor(table) {
		if (Selection.instance) return Selection.instance;

		this.table = table;
		this.active = this.table.root.select('[data-table="cell"]');

		Selection.instance = this;
	}

	set active(cell) {
		if (this.#active) {
			this.#active.delClass(Selection.activeClass);
		}

		this.table.root.focus();
		this.#active = cell.addClass(Selection.activeClass);
	}

	get active() {
		return this.#active;
	}

	get cellFocused() {
		return !!document.activeElement.closest('[data-table="cell"]');
	}

	onPointerdown(event) {
		const cell = $(event.target).closest('[data-table="cell"]');
		if (!cell) return;

		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);

		this.clearSelected();
		/* add active cell to selected because on poinermove
		selected arr clears and if user click on cell and 
		don`t move pointer selected arr will be empty */
		this.selected.push(cell);

		if (event.shiftKey) {
			this.selectGroup(cell);
		} else {
			this.active = cell;
		}

		this.selectionActive = true;
	}

	onPointermove(event) {
		if (!this.selectionActive) return;

		const hoveredElem = document.elementFromPoint(event.pageX, event.pageY);
		if (!hoveredElem) return;

		const lastSelected = $(hoveredElem).closest('[data-table="cell"]');
		this.selectGroup(lastSelected);
	}

	onPointerup() {
		this.selectionActive = false;
	}

	onDblclick() {
		this.active.focus();
	}

	onKeydown(event) {
		if (!Selection.navigationKeys.includes(event.code)) return;

		let { col, row } = cellChords(this.active);

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

			case 'Tab':
				event.preventDefault();

				if (event.shiftKey) {
					col -= 1;
				} else {
					col += 1;
				}

				break;

			case 'Enter':
				event.preventDefault();

				if (this.cellFocused) {
					if (event.shiftKey) {
						row -= 1;
					} else {
						row += 1;
					}
				} else {
					this.active.focus();
					return;
				}

				break;
			// no default
		}

		col = Math.max(0, col);
		col = Math.min(this.table.template.colsCount - 1, col);
		row = Math.max(0, row);
		row = Math.min(this.table.template.rowsCount - 1, row);

		const nextCell = this.table.root.select(`[data-cell-id="${col}:${row}"]`);

		this.clearSelected();
		/* add active cell to selected because on poinermove
		selected arr clears and if user click on cell and 
		don`t move pointer selected arr will be empty */
		this.selected.push(nextCell);
		this.active = nextCell;
	}

	selectGroup(lastSelected) {
		if (this.lastSelected === lastSelected || !lastSelected) return;

		this.clearSelected();
		this.lastSelected = lastSelected;

		const colsIds = range(cellChords(this.active).col, cellChords(lastSelected).col);
		const rowsIds = range(cellChords(this.active).row, cellChords(lastSelected).row);

		rowsIds.forEach(rowId => {
			colsIds.forEach(colId => {
				const row = $(this.table.rowsList.children[rowId]);
				const cellsList = row.select('[data-table-role="cells-list"]');
				const cell = $(cellsList.children[colId]);

				this.selected.push(cell);

				// don`t add selected class to active elem while selected.length < 2
				if (cell.elem === this.active.elem) return;

				cell.addClass(Selection.selectedClass);
			});
		});

		if (this.selected.length > 1) this.active.addClass(Selection.selectedClass);
	}

	clearSelected() {
		this.selected.forEach(cell => cell.delClass(Selection.selectedClass));
		this.selected = [];
	}
}
