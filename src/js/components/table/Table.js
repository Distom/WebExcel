import ExcelComponent from '../../core/ExcelComponent';
import Resizer from './Resizer';
import Scroll from './Scroll';
import Selection from './Selection';
import Template from './Template';

export default class Table extends ExcelComponent {
	static className = 'main-document__table document-table';

	static tagName = 'section';

	constructor(root) {
		super(root, {
			name: 'Table',
			listeners: ['pointerdown', 'pointerup', 'pointermove', 'dblclick', 'keydown', 'keyup'],
		});

		this.template = new Template(1000);
	}

	init() {
		super.init();

		this.initHTMLElements();

		this.scroll = new Scroll(this);
		this.resizer = new Resizer(this, 7);
		this.selection = new Selection(this);
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

	onKeyup(event) {
		// this.selection.onKeyup(event);
	}
}
