import Emitter from '../../core/Emitter';
import StoreSubscriber from '../../core/store/StoreSubsriber';
import $ from '../../core/dom';
import { updateLastOpenedDate } from '../../store/actions';

export default class Excel {
	static className = 'document';

	static mainElemClassName = 'document__main main-document';

	constructor(selector, options) {
		this.container = $(selector);
		this.components = options.components || [];
		this.emitter = new Emitter();
		this.store = options.store || {};
		this.storeSubscriber = new StoreSubscriber(this.store);
	}

	getRoot() {
		const root = $.create('div', Excel.className);
		const mainElem = $.create('main', Excel.mainElemClassName);
		const componentOptions = {
			emitter: this.emitter,
			store: this.store,
		};

		this.components = this.components.map(Component => {
			const componentElem = $.create(Component.tagName, Component.className);
			const component = new Component(componentElem, componentOptions);
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

	init() {
		this.store.dispatch(updateLastOpenedDate());
		this.storeSubscriber.subscribeComponents(this.components);
		this.components.forEach(component => component.init());
	}

	destroy() {
		this.storeSubscriber.unsubscribe();
		this.components.forEach(component => component.destroy());
	}
}
