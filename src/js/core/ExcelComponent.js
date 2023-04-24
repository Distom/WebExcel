import DomListener from './DomListener';

export default class ExcelComponent extends DomListener {
	unsubs = [];

	constructor(root, options = {}) {
		super(root, options.listeners);
		this.name = options.name || '';
		this.emitter = options.emitter;
		this.store = options.store;
		this.options = options.options;
		this.storeSubscribes = options.storeSubscribes || [];
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

	dispatch(action) {
		this.store.dispatch(action);
	}

	isWatching(storeKey) {
		return this.storeSubscribes.includes(storeKey);
	}

	storeChanged() {}

	init() {
		this.initEventListeners();
	}

	destroy() {
		this.removeEventListeners();
		this.unsubs.forEach(unsub => unsub());
	}
}
