import initialState from '../components/toolbar/initialState';
import {
	CHANGE_TITLE,
	SET_STYLES,
	TABLE_RESIZE,
	TEXT_INPUT,
	UPDATE_LAST_OPENED_TIMESTAMP,
} from './types';

export default function rootReducer(state, action) {
	switch (action.type) {
		case TABLE_RESIZE: {
			const stateKey = `${action.data.type}sState`;
			const newState = { ...state[stateKey], [action.data.index]: action.data.value };
			return { ...state, [stateKey]: newState };
		}

		case TEXT_INPUT: {
			const cellState = {
				...state.cellsState[action.data.id],
				data: action.data.text,
			};

			if (!cellState.data) delete cellState.data;

			const cellsState = getNewCellsState(action.data.id, cellState, state);

			return { ...state, cellsState };
		}

		case SET_STYLES: {
			const newStyles = {
				...state.cellsState[action.data.id]?.styles,
				...action.data.styles,
			};

			const cellState = {
				...state.cellsState[action.data.id],
				styles: newStyles,
			};

			if (isDefaultStyles(cellState.styles)) delete cellState.styles;

			const cellsState = getNewCellsState(action.data.id, cellState, state);

			return { ...state, cellsState };
		}

		case CHANGE_TITLE:
			return { ...state, title: action.data.text };

		case UPDATE_LAST_OPENED_TIMESTAMP:
			return { ...state, lastOpenedTimestamp: action.data.date };
		default:
			return state;
	}
}

function getNewCellsState(cellId, cellState, state) {
	let newCellsState;

	if (Object.getOwnPropertyNames(cellState).length) {
		newCellsState = {
			...state.cellsState,
			[cellId]: cellState,
		};
	} else {
		newCellsState = { ...state.cellsState };
		delete newCellsState[cellId];
	}

	return newCellsState;
}

function isDefaultStyles(styles) {
	let isDefault = true;
	Object.keys(styles).forEach(prop => {
		if (styles[prop] !== initialState[prop]) isDefault = false;
	});
	return isDefault;
}
