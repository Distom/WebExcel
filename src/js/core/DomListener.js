import { capitalize } from './utils';

function getEventMethodName(eventName) {
	return `on${capitalize(eventName)}`;
}

export default class DomListener {
	constructor(root, listeners = []) {
		this.root = root;
		this.listeners = listeners;
	}

	initEventListeners() {
		this.listeners.forEach(listener => {
			const methodName = getEventMethodName(listener);

			if (!this[methodName]) {
				throw new Error(`${methodName} method is not defined in ${this.name} component`);
			}

			this[methodName] = this[methodName].bind(this);
			this.root.on(listener, this[methodName]);
		});
	}

	removeEventListeners() {
		this.listeners.forEach(listener => {
			this.root.off(listener, this[getEventMethodName(listener)]);
		});
	}
}
