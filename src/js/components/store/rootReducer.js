import { TABLE_RESIZE, TEXT_INPUT } from './types';

export default function rootReducer(state, action) {
	let stateKey;
	let newState;

	switch (action.type) {
		case TABLE_RESIZE:
			stateKey = `${action.data.type}sState`;
			newState = { ...state[stateKey], [action.data.index]: action.data.value };
			return { ...state, [stateKey]: newState };
		case TEXT_INPUT:
			newState = { ...state.cellsState, [action.data.id]: action.data.text };
			return { ...state, cellsState: newState };
		default:
			return state;
	}
}
