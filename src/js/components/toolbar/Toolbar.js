import ExcelStateComponent from '../../core/ExcelStateComponent';
import $ from '../../core/dom';
import Template from './Template';
import initialState from './initialState';

export default class Toolbar extends ExcelStateComponent {
	static className = 'main-document__toolbar document-toolbar';

	static tagName = 'section';

	constructor(root, options = {}) {
		super(root, {
			name: 'Toolbar',
			listeners: ['click'],
			...options,
		});
	}

	init() {
		super.init();

		this.on('cell:changed', this.updateState.bind(this));
	}

	prepare() {
		this.initState(initialState);
		this.template = new Template(this);
	}

	get stateTemplate() {
		return this.template.createToolbar();
	}

	toHTML() {
		return this.stateTemplate;
	}

	onClick(event) {
		const button = $(event.target).closest('[data-type="button"]');
		if (!button) return;

		const styles = JSON.parse(button.data.value);

		this.setState(styles);
		this.emit('toolbar:changeStyles', styles);
	}

	updateState({ newCell }) {
		const styles = {
			...initialState,
			...this.store.getState().cellsState[newCell.data.cellId]?.styles,
		};
		this.setState(styles);
	}
}
