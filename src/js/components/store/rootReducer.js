import initialState from '../toolbar/initialState';
import { SET_STYLES, TABLE_RESIZE, TEXT_INPUT } from './types';

export default function rootReducer(state, action) {
	let stateKey;
	let newState;
	let newStyles;

	switch (action.type) {
		case TABLE_RESIZE:
			stateKey = `${action.data.type}sState`;
			newState = { ...state[stateKey], [action.data.index]: action.data.value };
			return { ...state, [stateKey]: newState };
		case TEXT_INPUT:
			newState = {
				...state.cellsState,
				[action.data.id]: {
					...state.cellsState[action.data.id],
					data: action.data.text,
				},
			};
			return { ...state, cellsState: newState };
		case SET_STYLES:
			newStyles = {
				...state.cellsState[action.data.id]?.styles,
				...action.data.styles,
			};
			newState = {
				...state.cellsState,
				[action.data.id]: {
					...state.cellsState[action.data.id],
					styles: isDefaultStyles(newStyles) ? null : newStyles,
				},
			};
			return { ...state, cellsState: newState };
		default:
			return state;
	}
}

function isDefaultStyles(styles) {
	let isDefault = true;
	Object.keys(styles).forEach(prop => {
		if (styles[prop] !== initialState[prop]) isDefault = false;
	});
	return isDefault;
}
