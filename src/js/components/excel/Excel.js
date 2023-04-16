import $ from '../../core/dom';

export default class Excel {
	static className = 'document__excel';

	static mainElemClassName = 'document__main main-document';

	constructor(selector, options) {
		this.container = $(selector);
		this.components = options.components || [];
	}

	getRoot() {
		const root = $.create('div', Excel.className);
		const mainElem = $.create('main', Excel.mainElemClassName);

		this.components = this.components.map(Component => {
			const componentElem = $.create(Component.tagName, Component.className);
			const component = new Component(componentElem);
			componentElem.html(component.toHTML());

			if (Component.tagName === 'header') {
				root.append(componentElem);
			} else {
				mainElem.append(componentElem);
			}

			return component;
		});

		root.append(mainElem);
		return root;
	}

	render() {
		this.container.append(this.getRoot());
		this.components.forEach(component => component.init());
	}
}
