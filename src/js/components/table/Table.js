import ExcelComponent from '../../core/ExcelComponent';
import $ from '../../core/dom';
import { cellChords, getRange } from '../../core/utils';
import { setStyles, textInput } from '../../store/actions';
import FormulaSelection from './FormulaSelection';
import MathParser from './MathParser';
import Resizer from './Resizer';
import Scroll from './Scroll';
import Selection from './Selection';
import Template from './Template';

export default class Table extends ExcelComponent {
	static className = 'main-document__table document-table';

	static tagName = 'section';

	constructor(root, options = {}) {
		super(root, {
			name: 'Table',
			listeners: ['pointerdown', 'pointerup', 'pointermove', 'dblclick', 'keydown', 'keypress'],
			...options,
		});
	}

	prepare() {
		this.mathParser = new MathParser(this);
		this.template = new Template(this, 100);
	}

	init() {
		super.init();

		this.initHTMLElements();

		this.scroll = new Scroll(this);
		this.resizer = new Resizer(this, 7);
		this.selection = new Selection(this);
		this.formulaSelection = new FormulaSelection(this);
		this.formulaSelection.addSelectionRect();

		this.on('formula:input', text => {
			this.selection.active.text(text);
			this.dispatch(textInput(this.selection.active.data.cellId, this.selection.active.text()));
		});
		this.on('formula:focus-cell', () => this.selection.focusActiveCell());
		this.on('toolbar:changeStyles', this.updateStyles.bind(this));
	}

	initHTMLElements() {
		this.header = this.root.select('[data-table="header"]');
		this.info = this.root.select('[data-table="info"]');
		this.rows = this.root.select('[data-table="rows"]');
		this.body = this.root.select('[data-table="body"]');

		this.headersList = this.root.select('[data-table-role="headers-list"]');
		this.rowsList = this.root.select('[data-table-role="rows-list"]');
		this.indexesList = this.root.select('[data-table-role="indexes-list"]');

		this.root.tabIndex = 0;
	}

	toHTML() {
		return this.template.html;
	}

	onPointerdown(event) {
		this.resizer.onPointerdown(event);
		this.selection.onPointerdown(event);
		this.formulaSelection.onPointerdown(event);
	}

	onPointermove(event) {
		this.resizer.onPointermove(event);
		this.selection.onPointermove(event);
		this.formulaSelection.onPointermove(event);
	}

	onPointerup(event) {
		this.resizer.onPointerup(event);
		this.selection.onPointerup(event);
		this.formulaSelection.onPointerup(event);
	}

	onDblclick(event) {
		this.selection.onDblclick(event);
	}

	onKeydown(event) {
		this.selection.onKeydown(event);
	}

	onKeypress(event) {
		this.selection.onKeypress(event);
	}

	getCells(startCell, endCell) {
		const cells = [];
		const colsIds = getRange(cellChords(startCell).col, cellChords(endCell).col);
		const rowsIds = getRange(cellChords(startCell).row, cellChords(endCell).row);

		rowsIds.forEach(rowId => {
			const row = [];

			colsIds.forEach(colId => {
				const cell = this.getCell(colId, rowId);
				row.push(cell);
			});

			cells.push(row);
		});

		return cells;
	}

	getCell(col, row) {
		const tableRow = $(this.rowsList.children[row]);
		const cellsList = tableRow.select('[data-table-role="cells-list"]');
		return $(cellsList.children[col]);
	}

	scrollRows(event, scrollBarWidth) {
		const scrollStep = 5;

		const scrollBarLeft = this.root.oWidth - scrollBarWidth;
		const scrollBarTop = this.root.oHeight + this.root.top - scrollBarWidth;
		const scrollBarRight = this.info.oWidth;
		const scrollBarBottom = this.root.top + this.header.oHeight;

		if (event.pageX >= scrollBarLeft) {
			this.rows.scrollBy({ left: scrollStep });
		} else if (event.pageX <= scrollBarRight) {
			this.rows.scrollBy({ left: -scrollStep });
		}

		if (event.pageY >= scrollBarTop) {
			this.body.scrollBy({ top: scrollStep });
		} else if (event.pageY <= scrollBarBottom) {
			this.body.scrollBy({ top: -scrollStep });
		}
	}

	updateStyles(styles) {
		/* eslint-disable no-console */
		const sel = window.getSelection();
		if (sel.type === 'None') {
			this.selection.selected.forEach(cells =>
				cells.forEach(cell => {
					cell.css(styles);
					this.dispatch(setStyles(cell.data.cellId, styles));
				}),
			);

			this.root.focus();
		} else {
			// эта часть недописана и оставлена до лучших времен, остались необрабатываемые варианты выделения
			try {
				const { active } = this.selection;
				console.log(sel.anchorNode === active.elem);

				if (sel.anchorNode === sel.focusNode) {
					console.log('same');
					// выделение внутри одной текстовой ноды
					const node = $(sel.anchorNode);
					const { anchorOffset, focusOffset } = sel;
					const parent = node.parentElem;
					let range = document.createRange();

					if (parent.elem === active.elem) {
						if (node.elem instanceof Text) {
							console.log('not wrapped');
							// выделенный текст оборачиваем в спан и применяются новые стили
							range = sel.getRangeAt(0);
							const span = $.create('span');
							range.surroundContents(span.elem);
							span.css(styles);

							if (anchorOffset === focusOffset) span.html('&nbsp;');

							range.selectNodeContents(span.elem);
						} else if (anchorOffset === focusOffset) {
							console.log('not text node');
							// также нода является спаном если в спане выделено не текстовое содержимое, а теги br или курсор стоит между тегами br
							const offset = anchorOffset;

							range.selectNodeContents(node.elem);
							range.setStart(node.elem, offset);
							const afterContent = range.extractContents();

							range.selectNodeContents(node.elem);
							range.setEnd(node.elem, offset);
							const prevContent = range.extractContents();

							const afterSpan = $.create('span').append(afterContent).css(node.css());

							const selectedSpan = $.create('span').html('&nbsp').css(node.css()).css(styles);

							node.html('').append(prevContent).after(selectedSpan);

							if (afterSpan.html()) selectedSpan.after(afterSpan);
							if (!node.html()) node.remove();

							this.selection.active.focus();

							range.selectNodeContents(selectedSpan.elem);
							sel.removeAllRanges();
							sel.addRange(range);
						} else {
							console.log('full wrapper');
							// нода является спаном если выделено всё содержимое спана, заменяем спан на его копию (для того чтоб избежать автозамены браузером на теги u, strong и тд.) и меняем стили
							const clone = node.clone(true);
							clone.css(styles);
							node.replaceWith(clone.elem);
							range.selectNodeContents(clone.elem);
						}

						this.selection.active.focus();
						sel.removeAllRanges();
						sel.addRange(range);
					} else if (node.elem === active.elem) {
						console.log('active node');
						// если такой вариант появился скорее всего ошибка в ручном создании выделения. Например при создании range выделено не содержимое ноды, а сама нода которая находится на верхнем уровне вложенности. Тогда selection.anchorNode будет элементом active
						const span = $.create('span').html('&nbsp;').css(styles);
						range = sel.getRangeAt(0);
						range.insertNode(span.elem);
						range.selectNodeContents(span.elem);

						this.selection.active.focus();
						sel.removeAllRanges();
						sel.addRange(range);
					} else {
						console.log('wrapped');
						// текстовая нода в которой выделено содержимое является вложенной в спан. Разбиваем спан на три спана. Из базового спана достаём выделенное содержимое и оставшееся содержимое и помещаем во второй и третий спан соответственно.Для второго и третьего спана возвращаем стили базового спана и после для второго спана применяем новые стили
						const [start, end] =
							sel.anchorOffset > sel.focusOffset
								? [sel.focusOffset, sel.anchorOffset]
								: [sel.anchorOffset, sel.focusOffset];

						const selectedContent = node.nodeValue.slice(start, end);

						range.selectNodeContents(parent.elem);
						range.setStart(node.elem, end);
						const afterContent = range.extractContents();

						range.selectNodeContents(parent.elem);
						range.setEnd(node.elem, start);
						const prevContent = range.extractContents();

						const afterSpan = $.create('span').append(afterContent).css(parent.css());

						const selectedSpan = $.create('span')
							.append(selectedContent)
							.css(parent.css())
							.css(styles);

						parent.html('').append(prevContent).after(selectedSpan);

						if (afterSpan.html()) selectedSpan.after(afterSpan);
						if (!parent.html()) parent.remove();

						this.selection.active.focus();

						if (start === end) {
							selectedSpan.html('&nbsp;');
							range.setStart(selectedSpan.elem, 1);
							range.collapse(true);
						}

						range.selectNodeContents(selectedSpan.elem);
						sel.removeAllRanges();
						sel.addRange(range);
					}
				} else {
					console.log('not same');
					// выделеные начинается и заканчивается в разныъ текстовых нодах

					// они могут находится в одном спане
					// могут находится в разных спанах
					// могут находиться на верхнем уровне активного элемента
					let inSameSpan = false;

					const anchor = $(sel.anchorNode);
					const focus = $(sel.focusNode);

					const anchorHigestParent =
						anchor.parentElem.elem === active.elem ? anchor : anchor.parentElem;

					const focusHigestParent =
						focus.parentElem.elem === active.elem ? focus : focus.parentElem;

					let anchorPosition = getIndex(anchorHigestParent, active);
					let focusPosition = getIndex(focusHigestParent, active);

					if (anchorPosition === focusPosition) {
						inSameSpan = true;
						anchorPosition = getIndex(anchor, anchorHigestParent);
						focusPosition = getIndex(focus, anchorHigestParent);
					}

					const [startNode, startOffset, endNode, endOffset] =
						anchorPosition > focusPosition
							? [focus, sel.focusOffset, anchor, sel.anchorOffset]
							: [anchor, sel.anchorOffset, focus, sel.focusOffset];

					const startNodeParent = startNode.parentElem;
					const endNodeParent = endNode.parentElem;
					const splitedSpan = startNode.parentElem;

					const startSplitedNode = splitNode(startNode, startOffset, 'end');
					const endSplitedNode = splitNode(endNode, endOffset, 'start');

					this.selection.active.focus();
					const range = document.createRange();

					if (inSameSpan) {
						console.log('in one span');
						// ноды находились в одном спане, мы разбили спан на 3 спана. Нужно вернуть всем спанам стили разбитого спана и применить новые стили к спану с выделенным содержимым
						const selectedSpan = endSplitedNode;
						const endSpan = startSplitedNode;
						const basicStyles = splitedSpan.css();

						selectedSpan.css(basicStyles).css(styles);
						endSpan.css(basicStyles);

						if (!splitedSpan.text()) splitedSpan.remove();
						if (!endSpan.text()) endSpan.remove();

						range.selectNodeContents(selectedSpan.elem);
					} else {
						// ноды находились в разных спанах или на верхнем уровне вложенности. Мы разбили ноды на ноду и спан с выделенным содержимым или спан на два спана (с выделенным содержимым и с оставшимся содержимым). Дальше необходимо пройтись по всему содержимому между стартовым спаном и конечным и обернуть всё необернутое содержимое в спаны. Если при разбитии нод мы разбили спан, необходимо сначала вернуть полученому спану с выделенным содержимым стили базового разбитого спана и после применить к нему новые стили. Далее необходимо пройтись по всем спанам между стартовым и конечным и применить к ним новые стили
						wrapAllTextNodes(startSplitedNode, endSplitedNode);

						if (startNodeParent.elem !== active.elem) {
							startSplitedNode.css(startNodeParent.css());
							if (!startNodeParent.text()) startNodeParent.remove();
						}

						if (endNodeParent.elem !== active.elem) {
							endSplitedNode.css(endNodeParent.css());
							if (!endNodeParent.text()) endNodeParent.remove();
						}

						const activeChildren = Array.from(active.children);

						activeChildren
							.slice(
								activeChildren.indexOf(startSplitedNode.elem),
								activeChildren.indexOf(endSplitedNode.elem) + 1,
							)
							.forEach(elem => {
								const domElem = $(elem);
								if (domElem.tag === 'SPAN') {
									domElem.css(styles);
								}
							});

						range.selectNodeContents(endSplitedNode.lChild);
						range.setStart(startSplitedNode.fChild, 0);
					}

					sel.removeAllRanges();
					sel.addRange(range);
				}
			} catch {
				console.warn('UpdateStylesError');
			}
		}
	}
}

function wrapAllTextNodes(startNode, endNode) {
	const range = document.createRange();
	let node = startNode;

	while (node.elem !== endNode.elem) {
		let { nextElem } = node;
		range.setStartAfter(node.elem);

		while (nextElem?.tag === 'BR' && nextElem.nextElem && nextElem.nextElem.elem !== endNode.elem) {
			nextElem = nextElem.nextElem;
		}

		range.setEndBefore(nextElem.elem);

		if (range.startOffset !== range.endOffset) {
			const span = $.create('span');
			range.surroundContents(span.elem);
		}

		node = nextElem;
	}
}

function splitNode(node, offset, returnNode) {
	const range = document.createRange();
	// для того чтоб обрабатывать вариант с br и прилетом спана, но это недоработано
	const parent = node.tag === 'SPAN' ? node : node.parentElem;

	if (parent.tag === 'SPAN') {
		range.selectNodeContents(parent.elem);
	} else {
		range.selectNode(node.elem);
	}

	if (returnNode === 'end') {
		range.setStart(node.elem, offset);
	} else if (returnNode === 'start') {
		range.setEnd(node.elem, offset);
	}

	const selectedContent = range.extractContents();
	const span = $.create('span').append(selectedContent);

	if (parent.tag === 'SPAN') {
		if (returnNode === 'start') {
			parent.before(span.elem);
		} else if (returnNode === 'end') {
			parent.after(span.elem);
		}

		// if (!parent.html()) parent.remove();
	} else if (returnNode === 'start') {
		node.replaceWith(span.elem, node.elem);
	} else if (returnNode === 'end') {
		node.replaceWith(node.elem, span.elem);
	}

	return span;
}

function getIndex(node, parent) {
	return Array.from(parent.childs).indexOf(node.elem);
}
