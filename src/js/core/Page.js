export default class Page {
	getRoot() {
		throw new Error(`Method getRoot in ${this.constructor.name} is not implemented`);
	}

	afterRender() {}

	destroy() {}
}
