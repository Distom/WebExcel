export default class Emitter {
	listeners = [];

	emit(event, ...args) {
		if (!this.listeners[event]) return false;
		this.listeners[event].forEach(fn => fn(...args));
		return true;
	}

	subscribe(event, fn) {
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(fn);
		return () => {
			this.listeners[event] = this.listeners[event].filter(func => func !== fn);
		};
	}
}
