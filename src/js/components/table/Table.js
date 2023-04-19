import ExcelComponent from '../../core/ExcelComponent';
import $ from '../../core/dom';
import Resizer from './Resizer';
import Scroll from './Scroll';
import Template from './Template';

export default class Table extends ExcelComponent {
	static className = 'main-document__table document-table';

	static tagName = 'section';

	constructor(root) {
		super(root, {
			name: 'Table',
			listeners: ['pointerdown', 'pointerup', 'pointermove'],
		});

		this.template = new Template(1000);
	}

	init() {
		super.init();

		this.header = $('.document-table__header');
		this.info = $('.document-table__info-column');
		this.rows = $('.document-table__rows');
		this.body = $('.document-table__body');

		this.resizer = new Resizer(this, 5);
		this.scroll = new Scroll(this);
	}

	toHTML() {
		return this.template.html;
	}

	onPointerdown(event) {
		if (event.target.closest('[data-resize]')) {
			this.resizer.onPointerdown(event);
		}
	}

	onPointermove(event) {
		this.resizer.onPointermove(event);
	}

	onPointerup(event) {
		this.resizer.onPointerup(event);
	}
}
