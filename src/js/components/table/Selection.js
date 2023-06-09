import Template from './Template';
import $ from '../../core/dom';
import { cellChords, getScrollBarWidth, getLastTextNode, defuseHTML } from '../../core/utils';
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
	];

	#active;

	isFormulaMode = false;

	selectionActive = false;

	#selected = [[]];

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

	set selected(arr) {
		if (arr[0][0]) {
			this.table.emit('table:select', { start: arr[0][0], end: arr.at(-1).at(-1) });
		}

		this.#selected = arr;
	}

	get selected() {
		return this.#selected;
	}

	set active(cell) {
		if (cell.elem === this.#active?.elem) return;

		if (this.#active) {
			this.#active.delClass(Selection.activeClass);
			this.activeObserver.disconnect();
			this.setCellHTML(this.#active, this.table.mathParser.parse(this.#active.data.content));
		}

		this.table.emit('cell:changed', {
			newCell: cell,
			oldCell: this.#active,
			oldCellHeight: this.#active?.oHeight,
		});

		window.getSelection().removeAllRanges();
		this.table.root.focus();
		this.clearSelected();
		this.selected = [[cell]];
		this.lastSelected = cell;
		this.#active = cell.addClass(Selection.activeClass);

		// at first call formulaSelection is not defined
		this.table.formulaSelection?.addSelectionRect(cell);

		this.activeObserver = new MutationObserver(() => {
			const clearHTML = defuseHTML(cell.html(), Template.allowedCellTags);
			this.isFormulaMode = clearHTML.startsWith('=');
			this.table.emit('cell:input', clearHTML);
			cell.data.content = clearHTML;
			this.table.dispatch(textInput(cell.data.cellId, clearHTML));
		});

		this.activeObserver.observe(cell.elem, { childList: true, subtree: true, characterData: true });
	}

	get active() {
		return this.#active;
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

		this.table.formulaSelection.removeSelectionRect();
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);

		if (event.shiftKey) {
			this.selectGroup(cell);
		} else {
			this.active = cell;
		}

		// update scrollBarWidth for autoscroll
		scrollBarWidth = getScrollBarWidth();

		this.selectionActive = true;
	}

	onPointermove(event) {
		if (!this.selectionActive) return;

		this.table.formulaSelection.removeSelectionRect();
		const hoveredElem = document.elementFromPoint(event.pageX, event.pageY);

		if (!hoveredElem) return;

		const lastSelected = $(hoveredElem).closest('[data-table="cell"]');

		if (lastSelected && lastSelected.elem !== this.lastSelected?.elem) {
			this.selectGroup(lastSelected);
		}

		this.table.scrollRows(event, scrollBarWidth);
	}

	onPointerup() {
		if (this.selectionActive) this.table.formulaSelection.addSelectionRect();
		this.selectionActive = false;
	}

	onDblclick() {
		this.focusActiveCell();
	}

	onKeypress() {
		if (this.cellFocused) return;

		this.clearCell(this.active);
		this.focusActiveCell();
		this.clearSelected();
		this.selected = [[this.active]];
		this.lastSelected = this.active;
	}

	onKeydown(event) {
		if (!Selection.navigationKeys.includes(event.code)) return;

		let { col, row } = cellChords(this.active);

		if (this.cellFocused) {
			switch (event.code) {
				case 'Enter':
					event.preventDefault();

					if (event.ctrlKey) {
						const sel = window.getSelection();
						const cursor = sel.anchorOffset;
						const br = $.create('br').elem;

						let rangeNode;
						let rangeOffset;
						let addOneToRangeOffset = false;
						const textNode = sel.anchorNode;

						if (!(textNode instanceof Text)) {
							const cursorNode = textNode.childNodes[cursor];

							if (!cursorNode) {
								textNode.append(br.cloneNode());
								textNode.append(br);
								rangeOffset = 2;
							} else {
								cursorNode.after(br);
								rangeOffset = cursor + 1;
							}

							rangeNode = textNode;
						} else {
							const textNodeText = textNode.nodeValue;
							const textNodeParent = textNode.parentElement;
							const wrapper = new DocumentFragment();

							wrapper.append(textNodeText.slice(0, cursor));
							wrapper.append(br);

							const afterText = textNodeText.slice(cursor);

							if (!textNode.nextSibling) {
								// if cursor is at the end of the text add another <br> to make the transition to a new line be working
								wrapper.append(afterText || br.cloneNode());
							} else {
								wrapper.append(afterText || '');
								addOneToRangeOffset = true;
							}

							textNodeParent.replaceChild(wrapper, textNode);

							if (afterText) {
								rangeNode = br.nextSibling;
								rangeOffset = 0;
							} else {
								rangeNode = textNodeParent;
								rangeOffset = Array.from(rangeNode.childNodes).indexOf(br) + 1;
								rangeOffset = addOneToRangeOffset ? rangeOffset + 1 : rangeOffset;
							}
						}

						const range = document.createRange();
						range.setStart(rangeNode, rangeOffset);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);

						return;
					}

					if (event.shiftKey) {
						row -= 1;
					} else {
						row += 1;
					}
					break;

				case 'Escape':
					event.preventDefault();
					this.clearCell(this.active);
					this.table.root.focus();
					this.table.formulaSelection.addSelectionRect();
					return;

				// no default
			}
		} else {
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

					this.selected.forEach(cells =>
						cells.forEach(cell => {
							this.clearCell(cell);
							this.table.dispatch(textInput(cell.data.cellId, ''));
						}),
					);

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
		if (nextCell.elem === this.active.elem) return;

		this.scrollToCell(nextCell);

		this.active = nextCell;
	}

	focusActiveCell() {
		this.clearSelected();
		this.table.formulaSelection.removeSelectionRect();
		this.setCellHTML(this.active, this.active.data.content);

		const textNode = getLastTextNode(this.active);

		if (textNode) {
			const range = document.createRange();
			const sel = window.getSelection();

			range.setStart(textNode, textNode.nodeValue.length);
			range.collapse(true);

			sel.removeAllRanges();
			sel.addRange(range);
		} else {
			this.active.focus();
		}
	}

	setCellHTML(cell, html) {
		cell.html(defuseHTML(html, Template.allowedCellTags));
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

	selectGroup(lastSelected, firstSelected = this.active) {
		if (!lastSelected) return;

		this.clearSelected();
		this.lastSelected = lastSelected;

		this.selected = this.table.getCells(firstSelected, lastSelected);

		this.selected.forEach(row => row.forEach(cell => cell.addClass(Selection.selectedClass)));

		if (this.selected.length === 1 && this.selected[0].length === 1) {
			this.active.delClass(Selection.selectedClass);
		}
	}

	clearSelected() {
		this.selected.forEach(row => row.forEach(cell => cell.delClass(Selection.selectedClass)));
		this.selected = [[this.active]];
		this.lastSelected = this.active;
	}

	clearCell(cell) {
		cell.data.content = '';
		cell.html('');
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
