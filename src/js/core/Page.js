export default class Page {
	constructor(params) {
		this.params = params;
	}

	getRoot() {
		throw new Error(`Method getRoot in ${this.constructor.name} is not implemented`);
	}

	afterRender() {}

	destroy() {}
}
