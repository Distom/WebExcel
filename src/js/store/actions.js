import {
	CHANGE_TITLE,
	SET_STYLES,
	TABLE_RESIZE,
	TEXT_INPUT,
	UPDATE_LAST_OPENED_TIMESTAMP,
} from './types';

export function tableResize(index, value, type) {
	return {
		type: TABLE_RESIZE,
		data: {
			index,
			value,
			type,
		},
	};
}

export function textInput(id, text) {
	return {
		type: TEXT_INPUT,
		data: {
			id,
			text,
		},
	};
}

export function setStyles(id, styles) {
	return {
		type: SET_STYLES,
		data: {
			id,
			styles,
		},
	};
}

export function changeTitle(text) {
	return {
		type: CHANGE_TITLE,
		data: {
			text,
		},
	};
}

export function updateLastOpenedDate(date = Date.now().toString()) {
	return {
		type: UPDATE_LAST_OPENED_TIMESTAMP,
		data: { date },
	};
}
