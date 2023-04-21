import DomListener from './DomListener';

export default class ExcelComponent extends DomListener {
	unsubs = [];

	constructor(root, options = {}) {
		super(root, options.listeners);
		this.name = options.name || '';
		this.emitter = options.emitter;
		this.options = options.options;
	}

	toHTML() {
		return '';
	}

	emit(event, ...args) {
		this.emitter.emit(event, ...args);
	}

	on(event, fn) {
		const unsub = this.emitter.subscribe(event, fn);
		this.unsubs.push(unsub);
	}

	init() {
		this.initEventListeners();
	}

	destroy() {
		this.removeEventListeners();
		this.unsubs.forEach(unsub => unsub());
	}
}
