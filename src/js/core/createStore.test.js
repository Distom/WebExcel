import createStore from './createStore';

function rootReducer(state, action) {
	switch (action.type) {
		case 'TEST': {
			return { ...state, isTested: true };
		}

		// no default
	}

	return state;
}

const initialState = {
	isInitial: true,
};

describe('createStore', () => {
	let store;

	beforeEach(() => {
		store = createStore(rootReducer, initialState);
	});

	it('return store object', () => {
		expect(store).toBeDefined();
		expect(store.dispatch).toBeDefined();
		expect(store.subscribe).toBeDefined();
		expect(store.getState).toBeDefined();
	});

	it('getState return initialState', () => {
		expect(store.getState()).toEqual(initialState);
	});

	it('change store if action exists', () => {
		store.dispatch({ type: 'TEST' });
		expect(store.getState()).toEqual({ ...initialState, isTested: true });
	});

	it("don't change store if action not exists", () => {
		store.dispatch({ type: 'NOT_EXISTS' });
		expect(store.getState()).toEqual(initialState);
	});

	it('call subscribers on dispatch', () => {
		const firstSubscriber = jest.fn();
		const secondSubscriber = jest.fn();

		store.subscribe(firstSubscriber);
		store.subscribe(secondSubscriber);
		store.dispatch({ type: 'TEST' });

		expect(firstSubscriber).toBeCalled();
		expect(secondSubscriber).toBeCalled();
	});

	it('call subscriber with state on dispatch', () => {
		const subscriber = jest.fn();

		store.subscribe(subscriber);
		store.dispatch({ type: 'TEST' });

		expect(subscriber).toBeCalledWith(store.getState());
	});

	it("don't call unsubscribed subscriber", () => {
		const subscriber = jest.fn();

		const unsubFn = store.subscribe(subscriber);
		unsubFn();
		store.dispatch({ type: 'TEST' });

		expect(subscriber).not.toBeCalled();
	});
});
