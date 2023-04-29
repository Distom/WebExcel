import ExcelComponent from '../../core/ExcelComponent';
import { setStyles, textInput } from '../../store/actions';
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
			listeners: ['pointerdown', 'pointerup', 'pointermove', 'dblclick', 'keydown'],
			...options,
		});
	}

	prepare() {
		this.template = new Template(this, 1000);
	}

	init() {
		super.init();

		this.initHTMLElements();

		this.scroll = new Scroll(this);
		this.resizer = new Resizer(this, 7);
		this.selection = new Selection(this);

		this.on('formula:input', text => {
			this.selection.active.text(text);
			this.dispatch(textInput(this.selection.active.data.cellId, this.selection.active.text()));
		});
		this.on('formula:focus-cell', () => this.selection.focusActiveCell());
		this.on('toolbar:changeStyles', this.updateStyles.bind(this));
		// this.on('toolbar:changeStyles', () => this.root.focus());
		// setInterval(() => console.log(window.getSelection()), 300);
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
	}

	onPointermove(event) {
		this.resizer.onPointermove(event);
		this.selection.onPointermove(event);
	}

	onPointerup(event) {
		this.resizer.onPointerup(event);
		this.selection.onPointerup(event);
	}

	onDblclick(event) {
		this.selection.onDblclick(event);
	}

	onKeydown(event) {
		this.selection.onKeydown(event);
	}

	/* 	onInput(event) {
		const cell = $(event.target).closest('[data-table="cell"]');
		if (!cell) return;

		this.emit('cell:input', this.selection.active.html());
		this.dispatch(textInput(cell.data.cellId, this.selection.active.text()));
	} */

	updateStyles(styles) {
		// this.selection.selected.forEach(cell => {
		// 	cell.css(styles);
		// 	this.dispatch(setStyles(cell.data.cellId, styles));
		// });

		const sel = window.getSelection();
		if (sel.type === 'None') {
			this.selection.selected.forEach(cell => {
				cell.css(styles);
				this.dispatch(setStyles(cell.data.cellId, styles));
			});
			this.root.focus();
		} else {
			console.log('Text selected');
		}
	}
}
