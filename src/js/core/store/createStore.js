import { cloneObj } from '../utils';

export default function createStore(rootReducer, initialState = {}) {
	let state = rootReducer({ ...initialState }, { type: '__INIT__' });
	let subscribers = [];

	return {
		dispatch(action) {
			state = rootReducer(state, action);
			subscribers.forEach(sub => sub(cloneObj(state)));
		},

		subscribe(fn) {
			if (!subscribers.includes(fn)) {
				subscribers.push(fn);
			}
			return () => (subscribers = subscribers.filter(sub => sub !== fn));
		},

		getState() {
			return cloneObj(state);
		},
	};
}
