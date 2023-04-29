import ExcelComponent from './ExcelComponent';

export default class ExcelStateComponent extends ExcelComponent {
	get stateTemplate() {
		return 'stateTemplate is not overrided';
	}

	initState(initialState = {}) {
		this.state = { ...initialState };
	}

	setState(newState) {
		if (!newState) return;

		this.state = { ...this.state, ...newState };
		this.root.html(this.stateTemplate);
	}
}
