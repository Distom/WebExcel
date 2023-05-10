import { isEqualObjects } from '../utils';

export default class StoreSubscriber {
	prevState = {};

	unsub = null;

	constructor(store) {
		this.store = store;
	}

	subscribeComponents(components = []) {
		this.prevState = this.store.getState();

		this.unsub = this.store.subscribe(state => {
			Object.keys(state).forEach(key => {
				if (!isEqualObjects(state[key], this.prevState[key])) {
					components.forEach(component => {
						if (component.isWatching(key)) {
							const changes = { [key]: state[key] };
							component.storeChanged(changes);
						}
					});
				}
			});

			this.prevState = this.store.getState();
		});
	}

	unsubscribe() {
		if (!this.unsub) return false;
		this.unsub();
		return true;
	}
}
